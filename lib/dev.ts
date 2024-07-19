import path from "path";
import { buildApp } from "@/lib/build";
import { BaseConfig, loadConfig } from "@/lib/config";
import { io, startDevServer } from "@/lib/server";
import { Network } from "@/lib/types";
import { loopThroughFiles, readFile, writeJson } from "@/lib/utils/fs";
import { mergeDeep, substractDeep } from "@/lib/utils/objects";
import { getWatchPaths, startFileWatcher } from "@/lib/watcher";
import { isWorkspaceProject, readWorkspace } from "@/lib/workspace";
import { notifyClientsOfChange } from "@/lib/socket";

export type DevOptions = {
  port?: number; // port to run dev server
  hot?: boolean; // enable hot reloading
  open?: boolean; // open browser
  network?: Network; // network to use
  gateway?: string | boolean; // path to custom gateway dist, or false to disable
  index?: string; // widget to use as index
};

export async function dev(src: string, dest: string, opts: DevOptions) {
  const isWorkspace = await isWorkspaceProject(src);

  if (isWorkspace) {
    log.debug("Running dev for workspace");
    devWorkspace(src, dest, opts);
  } else {
    log.debug("Running dev for app");
    devApp(src, dest, opts);
  }
}

export async function devApp(src: string, dest: string, opts: DevOptions) {
  src = path.resolve(src);
  const dist = path.join(src, dest);
  const devJsonPath = path.join(dist, "bos-loader.json");

  // Build the app
  let config = await loadConfig(src, opts.network);
  let devJson = await generateApp(src, dist, config, opts);
  await writeJson(devJsonPath, devJson);

  // Start the dev server
  startDevServer([src], [dist], devJsonPath, opts);

  // Watch for changes and rebuild
  const watchPaths = getWatchPaths(src);
  startFileWatcher(src, watchPaths, async (action: string, file: string) => {
    if (!file.startsWith(src)) {
      log.warn(`File ${file} doesn't belong to the app`);
      return;
    }

    log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);

    // Reload config and rebuild the app
    config = await loadConfig(src, opts.network);
    devJson = await generateApp(src, dist, config, opts);

    // Write the updated devJson to file
    await writeJson(devJsonPath, devJson);

    // Notify clients of the change
    notifyClientsOfChange(io, devJson);
  });
}

export async function devWorkspace(root: string, dest: string, opts: DevOptions) {
  const { apps } = await readWorkspace(root);
  const srcs = apps.map(app => path.resolve(root, app));
  const dists = apps.map(app => path.join(dest, path.relative(root, app)));
  const devJsonPath = path.join(dest, "bos-loader.json");

  // Build all apps
  let devJson = {};
  let configs = {};
  
  for (const [index, app] of apps.entries()) {
    configs[app] = await loadConfig(app, opts.network);
    const appDevJson = await generateApp(app, dists[index], configs[app], opts);
    devJson = mergeDeep(devJson, appDevJson);
  }
  await writeJson(devJsonPath, devJson);

  // Start the dev server
  startDevServer(srcs, dists, devJsonPath, opts);

  // Watch for changes in all apps
  const watchPaths = srcs.flatMap(app => getWatchPaths(path.relative(root, app)));
  startFileWatcher(root, watchPaths, async (action: string, file: string) => {
    const index = srcs.findIndex((src) => file.startsWith(src));
    if (index === -1) {
      log.warn(`File ${file} doesn't belong to any known app`);
      return;
    }
  
    const app = srcs[index];
    const dist = dists[index];

    log.info(`[${path.relative(app, file)}] changed: rebuilding app...`, LogLevels.DEV);

    // Remove the old app data from devJson
    const oldAppDevJson = configs[app] ? await generateApp(app, dist, configs[app], opts) : {};
    substractDeep(devJson, oldAppDevJson);

    // Reload config and rebuild the app
    configs[app] = await loadConfig(app, opts.network);
    const newAppDevJson = await generateApp(app, dist, configs[app], opts);

    // Merge the new app data into devJson
    devJson = mergeDeep(devJson, newAppDevJson);

    // Write the updated devJson to file
    await writeJson(devJsonPath, devJson);

    // Notify clients of the change
    notifyClientsOfChange(io, devJson as DevJson);
  });
}


export async function generateApp(src: string, appDist: string, config: BaseConfig, opts: DevOptions): Promise<DevJson> {
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
export async function generateDevJson(src: string, config: BaseConfig): Promise<DevJson> {
  let devJson: DevJson = { components: {}, data: {} };
  let devAccount: string = config.accounts?.dev || config.account;

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
