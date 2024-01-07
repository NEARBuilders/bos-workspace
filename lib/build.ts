import path from "path";
import { readConfig } from "@/lib/config";
import { writeJson, copy, loopThroughFiles, outputFile, readFile, readJson } from "@/lib/utils/fs";
import { transpileJS, EvalCustomSyntaxParams } from "@/lib/parser";
import { Log } from "@/lib/types";
import { UploadToIPFSOptions, uploadToIPFS } from "@/lib/ipfs";
import { generateData } from "@/lib/data";

// - reads all the files in src 
//   - check for bos.config.js
//   - check for aliases.json
//   - check for ipfs.json
// - uploads the changed /ipfs/ files to ipfs
// - generate ipfs.json files
// - transpiles the js/jsx/ts/tsx files in /module/ and /widget/
// - generates data.json
// return a list of files that were written
export async function buildApp(src: string, dest: string, network: string = "mainnet"): Promise<any> {
  const loading = log.loading(`Building app ${src}`, LogLevels.BUILD);

  const logs: Log[] = [];

  const config = await log.wait(readConfig(path.join(src, "bos.config.json"), network as any), "Reading bos.config.json", undefined, "Failed to read config file", LogLevels.BUILD);

  const aliasesSrcs = config?.aliases || [path.join(src, "aliases.json")];
  const aliases = {}
  for (const aliasesSrc of aliasesSrcs) {
    const aliasesData = await readJson(path.join(src, aliasesSrc)).catch(() => ({}));
    Object.assign(aliases, aliasesData);
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

  const loadingModules = log.loading(`Transpiling ${modules.length} modules`, LogLevels.BUILD);
  try {
    for (const file of modules) {
      const content = (await readFile(file)).toString();
      const new_file = await transpileJS(content, params, {
        compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
        format: true,
      });
      const new_logs: Log[] = new_file.logs.map((v) => {
        return {
          ...v,
          source: {
            line: v.source?.line,
            file: path.relative(path.join(src), file),
          }
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
    loadingModules.finish(`Transpiled ${modules.length} modules`);
  } catch (e) {
    loadingModules.error(`Failed to transpile modules`);
    throw e;
  }

  const loadingWidgets = log.loading(`Transpiling ${widgets.length} widgets`, LogLevels.BUILD);
  try {
    for (const file of widgets) {
      const content = (await readFile(file)).toString();
      const new_file = await transpileJS(content, params, {
        compileTypeScript: file.endsWith(".ts") || file.endsWith(".tsx"),
        format: true,
      });
      const new_logs: Log[] = new_file.logs.map((v) => {
        return {
          ...v,
          source: {
            line: v.source?.line,
            file: path.relative(path.join(src), file),
          }
        }
      });
      new_logs.forEach(log.send);

      logs.push(...new_logs);
      // write to dest
      let new_file_name = path.basename(file);
      new_file_name = new_file_name.substring(0, new_file_name.length - path.extname(file).length);
      new_file_name += ".jsx";

      const new_file_path = path.join(dest, "widget", new_file_name);
      await outputFile(new_file_path, new_file.code);
    }
    loadingWidgets.finish(`Transpiled ${widgets.length} widgets`);
  } catch (e) {
    loadingWidgets.error(`Failed to transpile widgets`);
    throw e;
  }

  await log.wait(
    generateData(src, dest, config.accounts!.deploy!),
    "Generating data.json",
    "Generated data.json",
    "Failed to generate data.json",
    LogLevels.BUILD,
  );

  loading.finish(`Built app ${src}`);

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

