import path from "path";
import { readConfig } from "@/lib/config";
import { writeJson, copy, loopThroughFiles, outputFile, readFile, readJson } from "@/lib/utils/fs";
import { transpileJS, EvalCustomSyntaxParams } from "@/lib/parser";
import { Log } from "@/lib/types";
import { UploadToIPFSOptions, uploadToIPFS } from "@/lib/ipfs";
import { generateData } from "@/lib/data";

// - reads all the files in src 
//   - check for bos.config.js
//   - check for aliases
//   - check for ipfs.json
// - uploads the changed /ipfs/ files to ipfs
// - generate ipfs.json files
// - transpiles the js/jsx/ts/tsx files in /module/ and /widget/
// - generates data.json
// return a list of files that were written
export async function buildApp(src: string, dest: string, network: string = "mainnet"): Promise<any> {
  const config = await readConfig(path.join(src, "bos.config.json"), network as any);
  const aliasesSrcs = config.aliases || [path.join(src, "aliases.json")];
  const aliases = {};
  for (const aliasesSrc of aliasesSrcs) {
    const new_aliases = await readJson(aliasesSrc).catch(() => ({}));
    Object.assign(aliases, new_aliases);
  }

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

  await generateData(src, dest, config.accounts!.deploy!);

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

