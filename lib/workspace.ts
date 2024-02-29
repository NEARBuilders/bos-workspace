import path from "path"
import { glob } from "glob"

import { buildApp } from "@/lib/build";
import { readJson } from "@/lib/utils/fs"
import { DevOptions, devMulti } from "@/lib/dev";

export async function buildWorkspace(src: string, dest: string, network: string = "mainnet"): Promise<any> {
  const loading = log.loading(`Building workspace ${src}`, LogLevels.BUILD);

  const { apps } = await readWorkspace(path.join(src, "bos.workspace.json"));

  log.info(`Found ${apps.length} apps\n`);

  for (const app of apps) {

    log.log(`[${path.resolve(app)}] `, LogLevels.BUILD);
    await buildApp(path.join(src, app), path.join(dest, app), network).catch((e: Error) => {
    });

    log.log("\n");
  }

  loading.finish(`Built workspace ${path.resolve(src)} to ${path.resolve(dest)}`);
};

export async function devWorkspace(src: string, devOpts: DevOptions): Promise<any> {
  const loading = log.loading(`Starting workspace ${src}`, LogLevels.BUILD);

  const { apps } = await readWorkspace(src);

  log.info(`Found ${apps.length} apps\n`);

  await devMulti(src, apps.map((app) => path.join(src, app)), devOpts);

  loading.finish(`Started workspace ${path.resolve(src)}`);
}

// finds all the valid apps 
type WorkspaceConfig = {
  apps: string[]
};

export async function readWorkspace(src: string): Promise<WorkspaceConfig> {
  const config = await readJson(path.join(src, "bos.workspace.json"));
  const expandedApps: string[] = [];

  for (const app of config.apps) {
    if (app.includes("*")) {
      const matches = glob.sync(path.join(src, app));
      expandedApps.push(...matches);
    } else {
      expandedApps.push(app);
    }
  }

  return { apps: expandedApps };
}