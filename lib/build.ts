// - reads all the files in src 
//   - check for bos.config.js
//   - check for aliases.json
//   - check for ipfs.json
// - uploads the changed /ipfs/ files to ipfs
// - generate ipfs.json files
// - transpiles the js/jsx/ts/tsx files in /module/ and /widget/
// - generates data.json

import { readConfig } from "@/lib/config";
import { writeJson, copy, loopThroughFiles, outputFile, readFile, readJson } from "@/lib/utils/fs";
import path from "path";
import { transpileJS, EvalCustomSyntaxParams } from "@/lib/parser";
import { Log } from "./types";
import { UploadToIPFSOptions, uploadToIPFS } from "./ipfs";

// return a list of files that were written
export async function buildApp(src: string, dest: string, network: string = "mainnet"): Promise<any> {
  const config = await readConfig(path.join(src, "bos.config.json"), network as any);
  const aliases = await readJson(path.join(src, "aliases.json")).catch(() => ({}));

  const ipfsMap = await updateIpfs(src, dest, {
    uploadAPI: {
      url: config.ipfs!.uploadApi!,
      headers: config.ipfs!.uploadApiHeaders!,
    }
  });

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
    modules: modules.map(file => path.relative(path.join(src, "module"), file.replace(path.extname(file), ""))),
    ipfsMap,
    ipfsGateway: config.ipfs!.gateway as string,
    aliases,
  };

  const logs: Log[] = [];

  for (const file of modules) {
    const content = (await readFile(file)).toString();
    const new_file = await transpileJS(content, params, {
      compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
      format: true,
    });
    const new_logs: Log[] = new_file.logs.map((v) => {
      return {
        ...v,
        file: file,
      }
    });
    logs.push(...new_logs);
    // write to dest
    let new_file_name = path.relative(path.join(src, "module"), file).replace("/", ".");
    new_file_name = new_file_name.substring(0, new_file_name.length - path.extname(file).length);
    new_file_name += ".module.js";

    const new_file_path = path.join(dest, "widget", new_file_name);

    await outputFile(new_file_path, new_file.code);
  }

  for (const file of widgets) {
    const content = (await readFile(file)).toString();
    const new_file = await transpileJS(content, params, {
      compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
      format: true,
    });
    const new_logs: Log[] = new_file.logs.map((v) => {
      return {
        ...v,
        file: file,
      }
    });
    logs.push(...new_logs);
    // write to dest
    let new_file_name = path.basename(file);
    new_file_name = new_file_name.substring(0, new_file_name.length - path.extname(file).length);
    new_file_name += ".jsx";

    const new_file_path = path.join(dest, "widget", new_file_name);
    await outputFile(new_file_path, new_file.code);
  }

  await updateData(src, dest, config.accounts!.deploy!);

  return {
    logs
  }
}

async function updateIpfs(pwd: string, dest: string, options: UploadToIPFSOptions): Promise<{
  [key: string]: string
}> {
  const ipfsMap = (await readJson(path.join(pwd, "ipfs.json")).catch(() => ({}))) || {};

  // 2. read all files in /ipfs/
  const ipfsFiles: string[] = [];
  await loopThroughFiles(path.join(pwd, "ipfs"), async (file: string) => {
    ipfsFiles.push(path.relative(path.join(pwd, "ipfs"), file));
  });

  // 3. upload the changed files to ipfs
  const ipfsUploads: { [key: string]: string } = {};
  for (const file of ipfsFiles) {
    if (!ipfsMap[file]) {
      // upload
      const cid = await uploadToIPFS(path.join(pwd, "ipfs", file), options);
      ipfsUploads[file] = cid;
    }
  }

  // 4. update ipfs.json
  const newIpfsMap = { ...ipfsMap };
  for (const file of Object.keys(ipfsUploads)) {
    newIpfsMap[file] = ipfsUploads[file];
  };

  await writeJson(path.join(pwd, "ipfs.json"), newIpfsMap, {
    spaces: 2,
  })
  await copy(path.join(pwd, "ipfs.json"), path.join(dest, "ipfs.json"));

  return newIpfsMap;
};

// TODO: This is bad, delete it, code it again under data.ts and TEST it.
async function updateData(pwd: string, dest: string, account: string): Promise<void> {
  const data = {};
  // all files in /data/
  await loopThroughFiles(path.join(pwd, "data"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".json" && ext !== ".jsonc" && ext !== ".txt") return;
    const content = await readFile(file);
    const keys: string[] = path.relative(path.join(pwd, "data"), file).replace(ext, "").split(path.sep);
    const obj = keys.reduceRight((acc: any, key) => {
      return {
        [key]: acc,
      }
    }, content.toString());
    Object.assign(data, obj);
  });
  // all metadata from /widget/ and /module/
  await loopThroughFiles(path.join(pwd, "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".jsonc" && ext !== ".json") return;
    if (!path.basename(file).endsWith(".metadata" + ext)) return;
    const content = await readJson(file);
    const keys: string[] = path.relative(path.join(pwd, "widget"), file).replace(".metadata" + ext, "").split(path.sep);
    const obj = keys.reduceRight(((acc: any, key: any) => {
      return {
        widget: {
          [key]: {
            "metadata": acc,
          }
        }
      }
    }), content);
    Object.assign(data, obj);
  });
  //
  const final_data = {
    [account]: data,
  };
  await writeJson(path.join(pwd, "data.json"), final_data, {
    spaces: 2,
  })
  await copy(path.join(pwd, "data.json"), path.join(dest, "data.json"));
}
