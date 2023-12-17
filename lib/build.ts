// - reads all the files in src 
//   - check for bos.config.js
//   - check for aliases.json
//   - check for ipfs.json
// - uploads the changed /ipfs/ files to ipfs
// - generate ipfs.json files
// - transpiles the js/jsx/ts/tsx files in /module/ and /widget/
// - generates data.json

import { readConfig } from "@/lib/config";
import { loopThroughFiles, outputFile, readFile, readJson } from "@/lib/utils/fs";
import path from "path";
import { transpileJS, EvalCustomSyntaxParams } from "@/lib/parser";

// return a list of files that were written
export async function buildApp(src: string, dest: string, network: string = "mainnet"): Promise<string[]> {
  const config = await readConfig(path.join(src, "bos.config.json"), network as any);
  const aliases = await readJson(path.join(src, "aliases.json")).catch(() => ({}));

  await updateIpfs();
  const ipfsMap = await readJson(path.join(src, "ipfs.json")).catch(() => ({}));


  const modules: string[] = [];
  const widgets: string[] = [];

  await loopThroughFiles(path.join(src, "module"), async (file: string) => {
    const ext = path.extname(file);
    if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
      modules.push(file);
    }
  })

  await loopThroughFiles(path.join(src, "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
      widgets.push(file);
    }
  })

  const params: EvalCustomSyntaxParams = {
    config,
    modules: modules.map(file => path.relative(path.join(src, "module"), file)),
    ipfsMap,
    ipfsGateway: config.ipfs!.gateway as string,
    aliases,
  };

  for (const file of modules) {
    const content = (await readFile(file)).toString();
    const new_file = await transpileJS(content, params, {
      compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
      format: true,
    });
    // write to dest
    let new_file_name = path.basename(file);
    new_file_name = new_file_name.substring(0, new_file_name.length - path.extname(file).length);
    new_file_name += ".module.js";

    const new_file_path = path.join(dest, "widget", new_file_name);

    outputFile(new_file_path, new_file.code);
  }

  for (const file of widgets) {
    const content = (await readFile(file)).toString();
    const new_file = await transpileJS(content, params, {
      compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
      format: true,
    });
    // write to dest
    let new_file_name = path.basename(file);
    new_file_name = new_file_name.substring(0, new_file_name.length - path.extname(file).length);
    new_file_name += ".jsx";

    const new_file_path = path.join(dest, "widget", new_file_name);
    outputFile(new_file_path, new_file.code);
  }

  await updateData();

  return [];
}

async function updateIpfs() {
};

async function updateData() {
};
