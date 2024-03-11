const fs = require("fs");
const { SHA256 } = require("crypto-js");
const { init_bos_config } = require("./config");

const NEAR_MAINNET_RPC = "https://rpc.mainnet.near.org/";
const TREE_DIR = "./tree.json";

const RpcManager = {
  id: 0,
  send: (request) =>
    fetch(NEAR_MAINNET_RPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }),
  getWidget: async (accountId, widgetPath) => {
    return RpcManager.getWidgets(accountId, [widgetPath]);
  },
  getWidgets: async (accountId, widgetsPath) => {
    const keys = await RpcManager.getAccountWidgetKeys(accountId, widgetsPath);
    const chunks = RpcManager.chunkinize(keys);

    const widgets = chunks.map(async (chunk) => {
      const request = {
        keys: chunk.map((path) => RpcManager.getWidgetPath(accountId, path)),
      };

      const result = await RpcManager.send(RpcManager.createRequest(request));

      const response = await result.json();

      const {
        [accountId]: { widget },
      } = RpcManager.parseResponse(response);

      return widget;
    });

    return await Promise.all(widgets).then((result) =>
      result.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    );
  },
  getAccountWidgetKeys: async (accountId, widgetsPath) => {
    const request = {
      keys: widgetsPath.map((path) =>
        RpcManager.getWidgetPath(accountId, path),
      ),
    };

    const result = await RpcManager.send(
      RpcManager.createRequest(request, "keys"),
    );

    const response = await result.json();

    const {
      [accountId]: { widget: keys },
    } = RpcManager.parseResponse(response);

    return Object.keys(keys || []);
  },
  createRequest: (args, method) => {
    return {
      method: "query",
      params: {
        request_type: "call_function",
        account_id: "social.near",
        method_name: method || "get",
        args_base64: btoa(JSON.stringify(args)),
        finality: "optimistic",
      },
      id: ++RpcManager.id,
      jsonrpc: "2.0",
    };
  },
  getWidgetPath: (accountId, widgetPath) => {
    return `${accountId}/widget/${widgetPath}`;
  },
  parseResponse: (response) => {
    const encodedData = RpcManager.processData(response.result.result);
    return JSON.parse(decodeURIComponent(escape(encodedData)));
  },
  processData: (data) => {
    let result = "";
    const chunkSize = 10000;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      result += String.fromCharCode(...chunk);
    }

    return result;
  },
  chunkinize: (data, size) => {
    return [...RpcManager.chunk(data, size || 100)];
  },
  chunk: function* (data, size) {
    for (let i = 0; i < data.length; i += size) {
      yield data.slice(i, i + size);
    }
  },
};

const Tree = {
  get: () => {
    if (fs.existsSync(TREE_DIR)) {
      const file = fs.readFileSync(TREE_DIR);
      return JSON.parse(file.toString("utf8") || "{}");
    }

    return {};
  },
  getAccount: (accountId, tree) => {
    const { [accountId]: accountTree } = tree || Tree.get();
    return accountTree || {};
  },
  update: (accountId, newAccountTree) => {
    let tree = Tree.get();
    tree[accountId] = newAccountTree;

    fs.writeFile(TREE_DIR, JSON.stringify(tree), "utf-8", (err) => {
      if (err) {
        console.log("Error updating tree: ", err);
      }
    });
  },
  delete: (accountId) => {
    let tree = Tree.get();
    delete tree[accountId];

    fs.writeFile(TREE_DIR, JSON.stringify(tree), "utf-8", (err) => {
      if (err) {
        console.log("Error updating tree: ", err);
      }
    });
  },
};

const WidgetManager = {
  save: (path, fileName, content) => {
    return new Promise((resolve, reject) => {
      const { fullPath, writeFilePath } = WidgetManager.getFullPath(
        path,
        fileName,
      );

      if (fs.existsSync(fullPath)) {
        let hash = SHA256(content).toString();

        fs.writeFile(writeFilePath, content, (err) => {
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
  sync: (path, fileName, content, tree) => {
    return new Promise((resolve, reject) => {
      const { fullPath, writeFilePath } = WidgetManager.getFullPath(
        path,
        fileName,
      );

      if (fs.existsSync(fullPath)) {
        let hash = SHA256(content).toString();

        if (!tree[writeFilePath] || tree[writeFilePath] !== hash) {
          fs.writeFile(writeFilePath, content, (err) => {
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
  delete: (file) => {
    fs.unlinkSync(file);
  },
  deleteAccount: (accountId) => {
    fs.rmSync(`./apps/${accountId}`, { recursive: true });
  },
  getFullPath: (path, fileName) => {
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

async function clone(accountId) {
  const folder = `apps/${accountId}/widget`;
  const widgets = await RpcManager.getWidgets(accountId, ["*"]);
  let accountTree = {};
  let treeModificationCount = 0;

  let processed = Object.keys(widgets).map(async (widgetName) => {
    const file = await WidgetManager.save(
      folder,
      widgetName,
      widgets[widgetName],
    );

    if (file !== null) {
      accountTree[file.path] = file.hash;
      treeModificationCount++;
    }
  });

  await Promise.all(processed);

  if (treeModificationCount > 0) {
    Tree.update(accountId, accountTree);
    console.log(`Download finished. Added ${treeModificationCount} files.`);
    // TODO: get correct version for init_bos_config
    init_bos_config(accountId);
    console.log("\nHappy coding!");
  }
}

async function pull(accountId) {
  const folder = `apps/${accountId}/widget`;
  const widgets = await RpcManager.getWidgets(accountId, ["*"]);
  let accountTree = Tree.getAccount(accountId);
  let treeModificationCount = 0;

  if (!Object.keys(accountTree).length) {
    console.log(
      "Cannot sync. You have to clone the project first using: bos-workspace clone " +
        accountId,
    );
    return;
  }

  let processed = Object.keys(widgets).map(async (widgetName) => {
    const file = await WidgetManager.sync(
      folder,
      widgetName,
      widgets[widgetName],
      accountTree,
    );

    if (file !== null) {
      accountTree[file.path] = file.hash;
      treeModificationCount++;
    }
  });

  await Promise.all(processed);

  if (treeModificationCount > 0) {
    Tree.update(accountId, accountTree);
    console.log(`Sync finished. Updated ${treeModificationCount} files.`);
  } else {
    console.log("Sync finished. No updates.");
  }
}

async function remove(accountId) {
  const accountTree = Tree.getAccount(accountId);

  if (!Object.keys(accountTree).length) {
    console.error(
      "Cannot remove account. You don't have components from " + accountId,
    );
    return;
  }

  let widgetCount = Object.keys(accountTree).length || 0;

  try {
    WidgetManager.deleteAccount(accountId);
    Tree.delete(accountId);
  } catch (error) {
    console.error(`Unable to remove ${accountId} components`);
  }

  console.log(`Removed ${widgetCount} components from ${accountId}`);
}

module.exports = {
  clone,
  pull,
  remove,
};
