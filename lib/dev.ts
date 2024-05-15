import { readJson, writeJson } from "fs-extra";
import path from "path";
import { Server as IoServer } from "socket.io";
import { buildApp } from "./build";
import { BaseConfig, loadConfig, readConfig } from "./config";
import { startDevServer } from "./server";
import { startSocket } from "./socket";
import { Network } from "./types";
import { loopThroughFiles, readFile } from "./utils/fs";
import { mergeDeep } from "./utils/objects";
import { startFileWatcher } from "./watcher";

const DEV_DIST_FOLDER = "build";

export type DevOptions = {
  port?: number; // port to run dev server
  NoGateway?: boolean; // disable local gateway
  NoHot?: boolean; // disable hot reloading
  NoOpen?: boolean; // do not open browser
  network?: Network; // network to use
  gateway?: string; // path to custom gateway dist
  index?: string; // widget to use as index
};

/**
 * Build and watch app according to bos.config.json
 * 
 * @param src path to app source code
 * @param opts DevOptions
 */
export async function dev(src: string, opts: DevOptions) {
  let io: null | IoServer = null;

  let config = await loadConfig(src, opts.network);
  const dist = path.join(src, DEV_DIST_FOLDER);
  const devJsonPath = path.join(dist, "bos-loader.json");
  const hotReloadEnabled = !opts.NoHot;

  // Build the app for the first time
  let devJson = await generateApp(src, dist, config, opts, devJsonPath);
  await writeJson(devJsonPath, devJson);

  // set index widget (temp, this can be done better)
  if (!opts.index && config.index) {
    opts.index = config.index;
  }

  // Start the dev server
  const server = startDevServer(devJsonPath, opts);

  // Start the socket server if hot reload is enabled
  if (hotReloadEnabled) {
    io = startSocket(server, (io: IoServer) => {
      readJson(devJsonPath).then((devJson: DevJson) => {
        io?.emit("fileChange", devJson);
      })
        .catch((err: Error) => {
          log.error(err.stack || err.message);
        })
    });
  }

  // Watch for changes in the src folder and rebuild the app on changes
  startFileWatcher([
    path.join(src, "widget/**/*"),
    path.join(src, "module/**/*"),
    path.join(src, "ipfs/**/*"),
    path.join(src, "bos.config.json"),
    path.join(src, "aliases.json")
  ], async (_: string, file: string) => {
    if (file.includes("bos.config.json")) {
      config = await loadConfig(src, opts.network);
    }
    log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);
    devJson = await generateApp(src, dist, config, opts, devJsonPath);
    await writeJson(devJsonPath, devJson);

    if (hotReloadEnabled && io) {
      io.emit("fileChange", devJson);
    }
  });
}

/**
 * Build and watch multiple apps according to a bos.workspace.json
 * 
 * @param root bos.workspace.json root directory
 * @param srcs apps to build and watch
 * @param opts DevOptions
 */
export async function devMulti(root: string, srcs: string[], opts: DevOptions) {
  let io: null | IoServer = null;
  const dist = path.join(root, DEV_DIST_FOLDER);
  const devJsonPath = path.join(dist, "bos-loader.json");
  let devJson = { components: {}, data: {} };

  // Build all apps for the first time and merge devJson
  for (const src of srcs) {
    const appDevJson = await generateApp(
      src,
      path.join(dist, path.relative(root, src)),
      await loadConfig(src, opts.network),
      opts,
      devJsonPath
    );
    await writeJson(devJsonPath, mergeDeep(devJson, appDevJson))
  }

  // Start the dev server
  const server = startDevServer(devJsonPath, opts);

  // Start the socket server if hot reload is enabled
  if (!opts.NoHot) {
    io = startSocket(server, (io: IoServer) => {
      readJson(devJsonPath).then((devJson: DevJson) => {
        io?.emit("fileChange", devJson);
      })
        .catch((err: Error) => {
          log.error(err.stack || err.message);
        })
    });
  }

  // Watch for changes in the mutliple srcs folder and rebuild apps on changes
  startFileWatcher(srcs.map((src) => [path.join(src, "widget/**/*"), path.join(src, "module/**/*"), path.join(src, "ipfs/**/*"), path.join(src, "bos.config.json"), path.join(src, "aliases.json")]).flat(), async (_: string, file: string) => {
    // find which app this file belongs to
    const src = srcs.find((src) => file.includes(src));
    if (!src) {
      return;
    }
    log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);
    // rebuild app
    const appDevJson = await generateApp(
      src,
      path.join(dist, path.relative(root, src)),
      await loadConfig(src, opts.network),
      opts,
      devJsonPath
    );
    // write to redirect map
    await writeJson(devJsonPath, mergeDeep(devJson, appDevJson))
    if (io) {
      io.emit("fileChange", devJson);
    }
  });
}

async function generateApp(src: string, appDist: string, config: BaseConfig, opts: DevOptions, distDevJson: string): Promise<DevJson> {
  await buildApp(src, appDist, opts.network);
  return await generateDevJson(appDist, config);
};

export interface DevJson {
  components: Record<string, {
    code: string;
  }>;
  data: Record<string, any>;
};

/**
 * Generates JSON redirect map
 * @param src path to build output
 * @param config bos.config.json
 * @returns 
 */
async function generateDevJson(src: string, config: BaseConfig): Promise<DevJson> {
  let devJson: DevJson = { components: {}, data: {} };
  let devAccount = config.accounts?.dev || config.account || "dev-1234";

  // for each js and jsx in src/widget
  await loopThroughFiles(path.join(src, "src", "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".js" && ext !== ".jsx") {
      return;
    }

    const widgetPath = path.relative(path.join(src, "src", "widget"), file).replace(ext, "");
    const widgetKey = `${devAccount}/widget/${widgetPath.split(path.sep).join(".")}`;

    // add to devJson.components
    devJson.components[widgetKey] = {
      code: await readFile(file, "utf-8"),
    }
  })

  return devJson;
}
