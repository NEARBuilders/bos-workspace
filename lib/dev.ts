import { FSWatcher } from "chokidar";
import path from "path";
import { Server as IoServer } from "socket.io";
import { buildApp } from "@/lib/build";
import { BaseConfig, loadConfig } from "@/lib/config";
import { startDevServer } from "@/lib/server";
import { startSocket } from "@/lib/socket";
import { Network } from "@/lib/types";
import { loopThroughFiles, readFile, readJson, writeJson } from "@/lib/utils/fs";
import { mergeDeep, substractDeep } from "@/lib/utils/objects";
import { startFileWatcher } from "@/lib/watcher";

var appSrcs = [], appDists = [];
var appDevJsons = [];
var appDevJsonPath = "bos-loader.json";
var appDevOptions: null | DevOptions = null;
let io: null | IoServer = null;
let fileWatcher: null | FSWatcher = null;

export type DevOptions = {
  port?: number; // port to run dev server
  hot?: boolean; // enable hot reloading
  open?: boolean; // open browser
  network?: Network; // network to use
  gateway?: string | boolean; // path to custom gateway dist, or false to disable
  index?: string; // widget to use as index
  output?: string; // output directory
};

/**
 * Build and watch app according to bos.config.json
 * 
 * @param src path to app source code
 * @param dest path to build output
 * @param opts DevOptions
 */
export async function dev(src: string, dest: string, opts: DevOptions) {
  const dist = path.join(src, dest);
  const devJsonPath = path.join(dist, "bos-loader.json");

  // Build the app for the first time
  const config = await loadConfig(src, opts.network);
  let devJson = await generateApp(src, dist, config, opts);
  await writeJson(devJsonPath, devJson);

  // set index widget (temp, this can be done better)
  if (!opts.index && config.index) {
    opts.index = config.index;
  }

  // Start the dev server
  appSrcs = [src];
  appDists = [dist];
  appDevJsons = [devJson];
  appDevJsonPath = devJsonPath;
  opts.output = dist;
  appDevOptions = opts;
  const server = startDevServer(appSrcs, appDists, appDevJsonPath, appDevOptions);

  // Start the socket server if hot reload is enabled
  if (opts.hot) {
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
  fileWatcher = startFileWatcher([
    path.join(src, "widget/**/*"),
    path.join(src, "module/**/*"),
    path.join(src, "ipfs/**/*"),
    path.join(src, "bos.config.json"),
    path.join(src, "aliases.json")
  ],
    fileWatcherCallback
  );
}

/**
 * Build and watch multiple apps according to a bos.workspace.json
 * 
 * @param root bos.workspace.json root directory
 * @param srcs apps to build and watch
 * @param dest path to build output
 * @param opts DevOptions
 */
export async function devMulti(root: string, srcs: string[], dest: string, opts: DevOptions) {
  const dist = path.join(root, dest);
  const devJsonPath = path.join(dist, "bos-loader.json");

  // Build all apps for the first time and merge devJson
  let appDevJson = { components: {}, data: {} };

  for (const src of srcs) {
    const config = await loadConfig(src, opts.network);
    const devJson = await generateApp(src, path.join(dist, path.relative(root, src)), config, opts);
    await writeJson(devJsonPath, mergeDeep(appDevJson, devJson));

    appSrcs.push(src);
    appDists.push(path.join(dist, path.relative(root, src)));
    appDevJsons.push(devJson);
  }

  // Start the dev server
  appDevJsonPath = devJsonPath;
  appDevOptions = opts;
  const server = startDevServer(appSrcs, appDists, appDevJsonPath, appDevOptions);

  // Start the socket server if hot reload is enabled
  if (opts.hot) {
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
  fileWatcher = startFileWatcher(
    srcs.map((src) => [
      path.join(src, "widget/**/*"),
      path.join(src, "module/**/*"),
      path.join(src, "ipfs/**/*"),
      path.join(src, "bos.config.json"),
      path.join(src, "aliases.json")
    ]).flat(),
    fileWatcherCallback
  );
}

export async function addApps(srcs: string[], dists: string[]) {
  let appDevJson = await readJson(appDevJsonPath, { throws: false });

  for (let i = 0; i < srcs.length; i++) {
    const src = srcs[i];
    const dist = dists[i];

    const config = await loadConfig(src, appDevOptions.network);
    const devJson = await generateApp(src, dist, config, appDevOptions);
    await writeJson(appDevJsonPath, mergeDeep(appDevJson, devJson));

    appSrcs.push(src);
    appDists.push(dist);
    appDevJsons.push(devJson);
  }

  if (io) {
    io.emit("fileChange", appDevJson);
  }

  if (fileWatcher) {
    fileWatcher.add(srcs.map((src) => [
      path.join(src, "widget/**/*"),
      path.join(src, "module/**/*"),
      path.join(src, "ipfs/**/*"),
      path.join(src, "bos.config.json"),
      path.join(src, "aliases.json")
    ]).flat()
    );
  }
}

async function fileWatcherCallback(action: string, file: string) {
  let appDevJson = await readJson(appDevJsonPath, { throws: false });

  // find which app this file belongs to
  const index = appSrcs.findIndex((src) => file.includes(path.resolve(src)));
  if (index == -1) {
    return;
  }

  const src = appSrcs[index];
  const dist = appDists[index];

  let devJson = appDevJsons[index];
  substractDeep(appDevJson, devJson);

  // rebuild app
  log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);
  const config = await loadConfig(src, appDevOptions.network);
  devJson = await generateApp(src, dist, config, appDevOptions);

  // write to redirect map
  await writeJson(appDevJsonPath, mergeDeep(appDevJson, devJson));
  appDevJsons[index] = devJson;
  if (io) {
    io.emit("fileChange", appDevJson);
  }
}

async function generateApp(src: string, appDist: string, config: BaseConfig, opts: DevOptions): Promise<DevJson> {
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
