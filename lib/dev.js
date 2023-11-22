const { glob } = require("glob");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const { read_bos_config } = require("./config");
const { build } = require("./build");

const distFolder = process.env.DIST_FOLDER || "build";

// Main function to orchestrate the dev script
async function dev() {
  // the first build,
  await build();

  // Start serving the development JSON
  const { io } = serveDevJson();

  setTimeout(() => {
    console.log("\nWatching for changes in the following folders");
    console.log(["./apps", "./modules"].join("\n"), "\n");
  }, 1000);
  watchFolders(["./apps", "./modules"], async (path) => {
    console.log(`\nChange detected in ${path}`);
    await build();
    console.log("Completed build successfully");
    if (io) {
      const devJson = generateAllDevJson();
      io.emit("fileChange", devJson);
    }
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
function serveDevJson(useSocket = true) {
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
    console.log(`\n
        ┌─────────────────────────────────────────────┐
        │ Server is up and running!                   │
        │                                             │
        │ ➤ Local: http://127.0.0.1:4040              │${
          useSocket
            ? `
        │ ➤ Socket: ws://127.0.0.1:4040               │`
            : ""
        }
        │                                             │
        │ To use the local widgets, please:           │
        │ 1. Visit https://near.org/flags             │
        │ 2. Paste the above local server URL.        │
        │                                             │
        └─────────────────────────────────────────────┘
    `);
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
