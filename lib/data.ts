import { copy, loopThroughFiles, readFile, readJson, writeJson } from "@/lib/utils/fs"
import path from "path";

export async function generateData(pwd: string, dest: string, account: string): Promise<object> {
  const data: any = {};
  // all files in /data/
  await loopThroughFiles(path.join(pwd, "data"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".json" && ext !== ".jsonc" && ext !== ".txt") return;
    const content = await readFile(file);
    const keys: string[] = path.relative(path.join(pwd, "data"), file).replace(ext, "").split(path.sep);
    const obj = keys.reduceRight(((acc: any, key: any) => {
      return {
        [key]: acc,
      }
    }),
      // if the file is a json, parse it
      // if the file is a jsonc, keep it as string
      // if the file is a txt, keep it as string
      ext === ".json" ? JSON.parse(content.toString()) : content.toString());
    Object.assign(data, obj);
  });
  // all metadata from /widget/ 
  await loopThroughFiles(path.join(pwd, "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".json") return;
    if (!path.basename(file).endsWith(".metadata" + ext)) return;
    const content = await readJson(file);
    const keys: string[] = path.relative(path.join(pwd, "widget"), file).replace(".metadata" + ext, "").split(path.sep);
    // the widget path should become the key but replace / with .
    const widget_path = keys.join(".").replace(/\\/g, ".");
    Object.assign(data, {
      widget: {
        ...(data.widget ? data.widget : {}),
        [widget_path]: { metadata: content, }
      }
    });
  });
  // all metadata from /module/ 
  await loopThroughFiles(path.join(pwd, "module"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".json") return;
    if (!path.basename(file).endsWith(".metadata" + ext)) return;
    const content = await readJson(file);
    const keys: string[] = path.relative(path.join(pwd, "module"), file).replace(".metadata" + ext, "").split(path.sep);
    const widget_path = keys.join(".").replace(/\\/g, ".");
    Object.assign(data, {
      widget: {
        ...(data.widget ? data.widget : {}),
        [widget_path]: { metadata: content, }
      }
    });
  });
  const final_data = {
    [account]: data,
  };
  await writeJson(path.join(pwd, "data.json"), final_data, {
    spaces: 2,
  })
  await copy(path.join(pwd, "data.json"), path.join(dest, "data.json"));

  return final_data;
}
