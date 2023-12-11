const { glob } = require("glob");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");

const { read_bos_config } = require("./config");
const { build } = require("./build");
const { log } = require("./utils");
const { injectHTML } = require("./parse");

// dist folder name when building an app
const distFolder = process.env.DIST_FOLDER || "build";

// the gateway dist path in node_modules
const GATEWAY_PATH = path.join(__dirname, "..", "gateway", "dist");

// Main function to orchestrate the dev script
async function dev(opts) {
  let loading = log.loading(`Building the project for the first time`);
  let apps = await build().catch((err) => {
    loading.error();
    log.error(err);
    process.exit(1);
  });
  loading.finish();

  log.info(
    `Detected apps: \n    - ${apps
      .map((app) => app.split("/")[1])
      .join("\n    - ")}\n`,
  );

  // Start serving the development JSON
  const { io } = await serveDevJson({
    port: opts.port || 3000,
    useGateway: !opts.NoGateway,
    useSocket: !opts.NoHot,
    useOpen: !opts.NoOpen,
  }).catch((err) => {
    log.error(err);
    process.exit(1);
  });

  watchFolders(["./apps", "./modules"], async (path) => {
    loading = log.loading(`Change detected in ${path}, rebuilding...`);
    await build().catch((err) => {
      loading.error();
      log.error(err);
      process.exit(1);
    });
    if (io) {
      const devJson = generateAllDevJson();
      io.emit("fileChange", devJson);
    }
    loading.finish();
  });

  setTimeout(() => {
    log.log("");
    log.info(
      [
        "Watching for changes in the following folders:",
        "   - ./apps",
        "   - ./modules",
      ].join("\n"),
    );
  }, 500);
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
    devJson.components = {
      ...devJson.components,
      ...appDevJson.components,
    };
    devJson.data = { ...devJson.data, ...appDevJson.data };
  }

  return devJson;
}

// serves the development json
async function serveDevJson({ useSocket, useGateway, useOpen, port }) {
  log.info(`Starting bos-workspace`);
  const app = express();
  let server = http.createServer(app);
  let io = null;

  if (useSocket) {
    log.sucess("Socket server setup successfully.");
    io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });
  }

  log.sucess("HTTP server setup successfully.");
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    );

    next();
  });

  app.get("/api/loader", (req, res) => {
    const devJson = generateAllDevJson();
    res.json(devJson);
  });

  if (useGateway) {
    // let's check if gateway/dist/index.html exists
    if (!fs.existsSync(path.join(GATEWAY_PATH, "index.html"))) {
      log.error("Gateway not found. Skipping...");
      useGateway = false;
    } else {
      // everything else is redirected to the gateway/dist
      app.use((req, res, next) => {
        if (req.path === "/") {
          return next();
        }
        express.static(GATEWAY_PATH)(req, res, next);
      });
      app.get("*", (req, res) => {
        // Inject Gateway with Environment Variables
        fs.readFile(
          path.join(GATEWAY_PATH, "index.html"),
          "utf8",
          (err, data) => {
            if (err) {
              log.error(err);
              return res.status(404).send("Something went wrong.");
            }
            const envConfig = JSON.stringify({
              bosLoaderWs: `ws://127.0.0.1:${port}`,
              bosLoaderUrl: `http://127.0.0.1:${port}/api/loader`,
              enableHotReload: useSocket,
            });
            const withEnv = injectHTML(data, { ENV_CONFIG: envConfig });
            res.send(withEnv);
          },
        );
      });
      log.sucess("Gateway setup successfully.");
    }
  }

  server
    .listen(port, "127.0.0.1", () => {
      if (useGateway && useOpen) {
        // open gateway in browser
        let start =
          process.platform == "darwin"
            ? "open"
            : process.platform == "win32"
              ? "start"
              : "xdg-open";
        start = process.env.WSL_DISTRO_NAME ? "explorer.exe" : start;
        exec(`${start} http://127.0.0.1:${port}`);
      }
      log.log(`
    ┌─────────────────────────────────────────────────────────────┐
    │ BosLoader Server is Up and Running                          │
    │                                                             │${
      useGateway
        ? `
    │ ➜ Local Gateway: \u001b[32mhttp://127.0.0.1:${port}\u001b[0m                      │`
        : ""
    }
    │                                                             │
    │ ➜ Bos Loader Http: \u001b[32mhttp://127.0.0.1:${port}/api/loader\u001b[0m         │${
      useSocket
        ? `
    │ ➜ Bos Loader WebSocket: \u001b[32mws://127.0.0.1:${port}\u001b[0m                 │`
        : ""
    }
    │                                                             │
    │ Optionaly, to open local widgets:                           │
    │ 1. Visit either of the following sites:                     │
    │    - https://near.org/flags                                 │
    │    - https://everything.dev/flags                           │
    │ 2. Paste the Bos Loader Http URL                            │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
 `);
      log.sucess(`bos-workspace runnig on port ${port}!`);
    })
    .on("error", (err) => {
      log.error(err);
      process.exit(1);
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
