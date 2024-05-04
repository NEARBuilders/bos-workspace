import { AccountID, Log } from "@/lib/types";
import { DEFAULT_CONFIG, readConfig } from "./config";
import fs, { existsSync, outputFile, writeFile } from "fs-extra";
import path from "path";
import { SHA256 } from "crypto-js";

/*
// Implement cloneRepository, pullRepository, and removeRepository functions
// pull from repository.js
// cloneRepository(account, dest);
// pullRepository(account, dest);
// removeRepository(account, dest);
*/

const NEAR_MAINNET_RPC = "https://rpc.mainnet.near.org/";
const TREE_DIR = "./tree.json";

const RpcManager = {
  id: 0,
  send: (request: any) =>
    fetch(NEAR_MAINNET_RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }),
  getWidget: async (account: AccountID, widgetPath: string) => {
    return RpcManager.getWidgets(account, [widgetPath]);
  },
  getWidgets: async (account: AccountID, widgetsPath: string[]) => {
    const keys = await RpcManager.getAccountWidgetKeys(account, widgetsPath);
    const chunks = RpcManager.chunkinize(keys);

    const widgets = chunks.map(async (chunk: string[]) => {
      const request = {
        keys: chunk.map((path: string) => RpcManager.getWidgetPath(account, path)),
      };

      const result = await RpcManager.send(RpcManager.createRequest(request));

      const response = await result.json();

      const {
        [account]: { widget },
      } = RpcManager.parseResponse(response);

      return widget;
    });

    return await Promise.all(widgets).then((result) =>
      result.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    );
  },
  getAccountWidgetKeys: async (account: AccountID, widgetsPath: string[]) => {
    const request = {
      keys: widgetsPath.map((path: string) =>
        RpcManager.getWidgetPath(account, path),
      ),
    };

    const result = await RpcManager.send(
      RpcManager.createRequest(request, "keys"),
    );

    const response = await result.json();
    const parsedResp = RpcManager.parseResponse(response);

    if (!parsedResp[account]) {
      log.error(`Are you sure this account exists? : ${account}`);
      return [];
    }

    const {
      [account]: { widget: keys },
    } = parsedResp;

    return Object.keys(keys || []);
  },
  createRequest: (args: any, method?: string) => {
    return {
      method: "query",
      params: {
        request_type: "call_function",
        account_id: "social.near",
        method_name: method || "get",
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
      },
      id: ++RpcManager.id,
      jsonrpc: "2.0",
    };
  },
  getWidgetPath: (account: AccountID, widgetPath: string) => {
    return `${account}/widget/${widgetPath}`;
  },
  parseResponse: (response: any) => {
    const encodedData = RpcManager.processData(response.result.result);
    return JSON.parse(decodeURIComponent(escape(encodedData)));
  },
  processData: (data: any) => {
    let result = "";
    const chunkSize = 10000;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      result += String.fromCharCode(...chunk);
    }

    return result;
  },
  chunkinize: (data: any, size?: number) => {
    return [...RpcManager.chunk(data, size || 100)];
  },
  chunk: function* (data: any, size: number) {
    for (let i = 0; i < data.length; i += size) {
      yield data.slice(i, i + size);
    }
  },
};

const Tree = {
  get: () => {
    if (existsSync(TREE_DIR)) {
      const file = fs.readFileSync(TREE_DIR);
      return JSON.parse(file.toString("utf8") || "{}");
    }

    return {};
  },
  getAccount: (account: AccountID, tree?: any) => {
    const { [account]: accountTree } = tree || Tree.get();
    return accountTree || {};
  },
  update: (account: AccountID, newAccountTree: any) => {
    let tree = Tree.get();
    tree[account] = newAccountTree;

    writeFile(TREE_DIR, JSON.stringify(tree), "utf-8", (err) => {
      if (err) {
        console.log("Error updating tree: ", err);
      }
    });
  },
  delete: (account: AccountID) => {
    let tree = Tree.get();
    delete tree[account];

    writeFile(TREE_DIR, JSON.stringify(tree), "utf-8", (err) => {
      if (err) {
        console.log("Error updating tree: ", err);
      }
    });
  },
};

const WidgetManager = {
  save: (path: string, fileName: string, content: any) => {
    return new Promise((resolve, reject) => {
      const { fullPath, writeFilePath } = WidgetManager.getFullPath(
        path,
        fileName,
      );

      if (existsSync(fullPath)) {
        let hash = SHA256(content).toString();

        writeFile(writeFilePath, content, (err: any) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          console.log("Added " + fileName);
          resolve({
            path: writeFilePath,
            hash,
          });
        });
      } else {
        fs.mkdir(fullPath, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }

          WidgetManager.save(path, fileName, content)
            .then(resolve)
            .catch(reject);
        });
      }
    });
  },
  sync: (path: string, fileName: string, content: any, tree?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { fullPath, writeFilePath } = WidgetManager.getFullPath(
        path,
        fileName,
      );

      if (existsSync(fullPath)) {
        let hash = SHA256(content).toString();

        if (!tree[writeFilePath] || tree[writeFilePath] !== hash) {
          writeFile(writeFilePath, content, (err: any) => {
            if (err) {
              return reject(err);
            }

            console.log(
              (!tree[writeFilePath] ? "Added " : "Updated ") + fileName,
            );
            resolve({
              path: writeFilePath,
              hash,
            });
          });
        } else {
          resolve(null);
        }
      } else {
        fs.mkdir(fullPath, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }

          WidgetManager.sync(path, fileName, content, tree)
            .then(resolve)
            .catch(reject);
        });
      }
    });
  },
  delete: (file: string) => {
    fs.unlinkSync(file);
  },
  getFullPath: (path: string, fileName: string) => {
    const breadcrumb = fileName.split(".");
    const widgetName = breadcrumb.pop();
    const widgetPath = breadcrumb.join("/");

    return {
      fullPath: `./${path}/${widgetPath}/`,
      writeFilePath: `./${path}/${widgetPath}/${widgetName}.jsx`,
      widget: widgetName,
    };
  },
};

export async function cloneRepository(account: string, dest: string): Promise<any> {
  const loading = log.loading(`Cloning ${account} to ${dest}`, LogLevels.BUILD);

  const widgets = await RpcManager.getWidgets(account, ["*"]);
  let accountTree: Record<string, string> = {};
  let treeModificationCount = 0;

  let processed = Object.keys(widgets).map(async (widgetName) => {
    const file: any = await WidgetManager.save(
      path.join(dest, "widget"),
      widgetName,
      widgets[widgetName],
    );

    if (file) {
      accountTree[file.path] = file.hash;
      treeModificationCount++;
    }
  });

  await Promise.all(processed);

  if (treeModificationCount > 0) {
    Tree.update(account, accountTree);
    console.log(`Download finished. Added ${treeModificationCount} files.`);

    try {
      const configPath = path.join(dest, "bos.config.json");
      const config = DEFAULT_CONFIG;
      config.account = account;

      const dir = path.dirname(configPath);

      await fs.ensureDir(dir);
      await outputFile(configPath, JSON.stringify(config));
      console.log("\nInitialized bos.config.json for " + account);
    } catch (error) {
      console.error("\nUnable to generate bos.config.json for " + account);
    }

    return false;
  }
}

export async function pullRepository(account: string | undefined): Promise<any> {
  const loading = log.loading(`Pulling recent changes from ${account}`, LogLevels.BUILD);
  if (!account) {
    const config = await log.wait(readConfig(path.join(".", "bos.config.json")), "Reading bos.config.json", undefined, "Failed to read config file", LogLevels.BUILD).catch(() => {
      loading.error(`Error: Please provide an account or ensure bos.config.json exists in the current directory.`);
    });
    account = config.account;
  }

  const widgets = await RpcManager.getWidgets(account!, ["*"]);
  let accountTree = Tree.getAccount(account!);
  let treeModificationCount = 0;

  if (!Object.keys(accountTree).length) {
    console.log(
      "Cannot sync. You have to clone the project first using: bos-workspace clone " +
      account,
    );
    return;
  }

  let processed = Object.keys(widgets).map(async (widgetName) => {
    const file = await WidgetManager.sync(
      path.join("widget", widgetName),
      widgets[widgetName],
      accountTree,
    );

    if (file) {
      accountTree[file.path] = file.hash;
      treeModificationCount++;
    }
  });

  await Promise.all(processed);

  if (treeModificationCount > 0) {
    Tree.update(account!, accountTree);
    console.log(`Sync finished. Updated ${treeModificationCount} files.`);
  } else {
    console.log("Sync finished. No updates.");
  }
}
