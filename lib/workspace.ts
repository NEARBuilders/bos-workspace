import { glob } from "glob";
import path from "path";

import { pathExists, readJson } from "@/lib/utils/fs";


// finds all the valid apps 
type WorkspaceConfig = {
  apps: string[]
};

export async function readWorkspace(src: string): Promise<WorkspaceConfig> {
  const config = await readJson(path.join(src, "bos.workspace.json"));
  const expandedApps: string[] = [];

  for (const app of config.apps) {
    if (app.includes("*")) {
      const matches = glob.sync(path.join(src, app), {
        windowsPathsNoEscape: true,
      });
      expandedApps.push(...matches);
    } else {
      expandedApps.push(app);
    }
  }

  return { apps: expandedApps };
}

export async function isWorkspaceProject(src: string): Promise<boolean> {
  return pathExists(path.join(src, "bos.workspace.json"));
}