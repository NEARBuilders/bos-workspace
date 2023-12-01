const { glob } = require("glob");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const { read_bos_config } = require("./config");
const { build } = require("./build");
const { log } = require("./utils");
const { install_gateway_packages, run_gateway } = require("./gateway");

const distFolder = process.env.DIST_FOLDER || "build";

// Main function to orchestrate the dev script
async function dev() {
  let loading = log.loading(`Building the project for the first time`);
  await build().catch((err) => {
    loading.error();
    log.error(err);
    process.exit(1);
  });
  loading.finish();

  // Start serving the development JSON
  loading = log.loading(`Starting the bos loader server`);
    const { io } = serveDevJson(true).catch((err) => {
        loading.error();
        log.error(err);
        process.exit(1);
    });
    loading.finish();

    log.log(`\n
 ┌─────────────────────────────────────────────┐
 │ Server is up and running!                   │
 │                                             │
 │ ➜ Local: http://127.0.0.1:4040              │
 │ ➜ Socket: ws://127.0.0.1:4040               │
 │                                             │
 │ To use the local widgets, please:           │
 │ 1. Visit https://near.org/flags             │
 │ 2. Paste the above local server URL.        │
 │                                             │
 └─────────────────────────────────────────────┘
    `);

   log.info(["Watching for changes in the following folders:", "./apps", "./modules", "\n"].join("\n"));

  watchFolders(["./apps", "./modules"], async (path) => {
    loading = log.loading(`Change detected in ${path}, rebuilding...`);
    await build().catch((err) => {
        loading.error();
        log.error(err);
        process.exit(1);
    })
    if (io) {
      const devJson = generateAllDevJson();
      io.emit("fileChange", devJson);
    }
    loading.finish();
  });

  
    install_gateway_packages().then(() => {
        run_gateway();
    });
}

// generate the development json from the apps widgets
function generateDevJson(appFolder) {
  let devJson = { components: {}, data: {} };

  const appConfig = read_bos_config(appFolder);
  if (!appConfig.appAccount) {
    return devJson;
  }
  const widgetFiles = glob.sync(
    `./${distFolder}/${appFolder}/src/**/*.{js,jsx,ts,tsx}`,
    {
      windowsPathsNoEscape: true,
    },
  );

  const dataJSON = JSON.parse(
    fs.readFileSync(path.join(".", distFolder, appFolder, "data.json"), "utf8"),
  );
  devJson.data = { [appConfig.appAccount]: dataJSON };

  widgetFiles.forEach((file) => {
    let fileContent = fs.readFileSync(file, "utf8");
    let widgetPath = file
      .replace(path.join(".", distFolder, appFolder, "src"), "")
      .replace(path.extname(file), "");
    let widgetKey = `${appConfig.appAccount}/widget/${widgetPath
      .slice(1)
      .split(path.sep)
      .join(".")}`;
    devJson.components[widgetKey] = { code: fileContent };
  });

  return devJson;
}

// watch for changes in the specified folders and run the callback
function watchFolders(folders, callback) {
  const watcher = chokidar.watch(folders, { persistent: true });

  watcher.on("change", (path) => {
    callback(path);
  });
}

function generateAllDevJson() {
  let devJson = { components: {}, data: {} };
  const appFolders = fs.readdirSync("./apps");

  for (const appFolder of appFolders) {
    let appDevJson = generateDevJson(appFolder);
    devJson.components = { ...devJson.components, ...appDevJson.components };
    devJson.data = { ...devJson.data, ...appDevJson.data };
  }

  return devJson;
}

// serves the development json
async function serveDevJson(useSocket = true) {
  const app = express();
  let server = http.createServer(app);
  let io = null;

  if (useSocket) {
    io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });
  }

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    );

    next();
  });

  app.get("/", (req, res) => {
    const devJson = generateAllDevJson();
    res.json(devJson);
  });

  server.listen(4040, "127.0.0.1", () => {
  });

  if (useSocket) {
    io.on("connection", () => {
      const devJson = generateAllDevJson();
      io.emit("fileChange", devJson);
    });
  }

  return { io };
}

module.exports = {
  dev,
  generateDevJson,
  serveDevJson,
  watchFolders,
};
