import { loopThroughFiles, readJson } from "./utils/fs"
import path from "path";

export async function getData(pwd: string): Promise<object> {
  return {}
}

export async function getMetadata(pwd: string): Promise<object> {
  const data: any = {
    widget: {},
  }
  await loopThroughFiles(pwd, async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".json") return;
    if (!path.basename(file).endsWith(".metadata" + ext)) return;
    const metadata = await readJson(file);
    const widgetName = path.relative(pwd, file).replace(".metadata" + ext, "").split(path.sep).join(".");
    data.widget[widgetName] = {
      metadata: metadata,
    }
  })
  return data;
}

export async function generateData(src: string, dest: string): Promise<object> {
  return {}
}
