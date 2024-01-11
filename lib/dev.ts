import path from "path";
import { buildApp } from "./build";
import { BaseConfig, readConfig } from "./config";
import { loopThroughFiles, readFile } from "./utils/fs";
import { Network } from "./types";
import { watch, existsSync, writeJson, readJsonSync, readJson } from "fs-extra";
import express from "express";
import http from "http";
import { Server as IoServer } from "socket.io";
import { exec } from "child_process";
import { Gaze } from "gaze";

const DEV_DIST_FOLDER = path.join(".bos", "build");

// the gateway dist path in node_modules
const GATEWAY_PATH = path.join(__dirname, "..", "gateway", "dist");

type DevOptions = {
  port?: number;
  NoGateway?: boolean;
  NoHot?: boolean;
  NoOpen?: boolean;
  network?: Network;
};

export async function dev(src: string, opts: DevOptions) {
  let config = await readConfig(path.join(src, "bos.config.json"), opts.network);
  const dist = path.join(src, DEV_DIST_FOLDER);
  const distDevJson = path.join(dist, "bos-loader.json");

  // 1. build app for the first time
  await generateApp(src, dist, config, opts, distDevJson);

  // 2. Start the server
  const { io } = startServer(opts, distDevJson);

  // 3. watch for changes in the src folder, rebuild app on changes
  const gaze = new Gaze([path.join(src, "widget/**/*"), path.join(src, "module/**/*"), path.join(src, "ipfs/**/*"), path.join(src, "bos.config.json"), path.join(src, "aliases.json")], { debounceDelay: 100 });

  // @ts-ignore
  gaze.on("all", async (_: string, file: string) => {
    if (file.includes("bos.config.json")) {
      config = await readConfig(path.join(src, "bos.config.json"), opts.network);
    }
    log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);
    const devJson = await generateApp(src, dist, config, opts, distDevJson);

    if (io) {
      io.emit("fileChange", devJson);
    }

    return devJson
  });

}

async function generateApp(src: string, dist: string, config: BaseConfig, opts: DevOptions, distDevJson: string): Promise<DevJson> {
  await buildApp(src, DEV_DIST_FOLDER, opts.network);
  const devJson = await generateDevJson(dist, config);
  await writeJson(distDevJson, devJson);
  return devJson;
};


function startServer(opts: DevOptions, devJsonPath: string) {
  log.info(`Starting bos-workspace`);

  // sanitize port to only allow numbers
  const port = opts.port ? parseInt(opts.port.toString().replace(/\D/g, "")) : 3000;

  const app = express();
  const server = http.createServer(app);
  let io: null | IoServer = null;

  if (!opts.NoHot) {
    log.success("Socket server setup successfully.");
    io = new IoServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });
  }

  log.success("HTTP server setup successfully.");
  app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    );

    next();
  });

  app.get("/api/loader", (_, res) => {
    readJson(devJsonPath).then((devJson: DevJson) => {
      res.json(devJson);
    })
      .catch((err: Error) => {
        log.error(err.stack || err.message);
        return res.status(500).send("Something went wrong.");
      })
  });

  if (!opts.NoGateway) {
    // let's check if gateway/dist/index.html exists
    if (!(existsSync(path.join(GATEWAY_PATH, "index.html")))) {
      log.error("Gateway not found. Skipping...");
      opts.NoGateway = true;
    } else {
      // everything else is redirected to the gateway/dist
      app.use((req, res, next) => {
        if (req.path === "/") {
          return next();
        }
        express.static(GATEWAY_PATH)(req, res, next);
      });
      app.get("*", (_, res) => {
        // Inject Gateway with Environment Variables
        readFile(
          path.join(GATEWAY_PATH, "index.html"),
          "utf8",
        ).then((data) => {
          const envConfig = JSON.stringify({
            bosLoaderWs: `ws://127.0.0.1:${port}`,
            bosLoaderUrl: `http://127.0.0.1:${port}/api/loader`,
            enableHotReload: opts.NoHot ? false : true,
          });
          const withEnv = injectHTML(data, { ENV_CONFIG: envConfig });
          res.send(withEnv);
        }).catch((err) => {
          log.error(err);
          return res.status(404).send("Something went wrong.");
        })
      });
      log.success("Gateway setup successfully.");
    }
  }

  server
    .listen(port, "127.0.0.1", () => {
      if (!opts.NoGateway && !opts.NoOpen) {
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
    │                                                             │${!opts.NoGateway
          ? `
    │ ➜ Local Gateway: \u001b[32mhttp://127.0.0.1:${port}\u001b[0m                      │`
          : ""
        }
    │                                                             │
    │ ➜ Bos Loader Http: \u001b[32mhttp://127.0.0.1:${port}/api/loader\u001b[0m         │${!opts.NoHot
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
      log.success(`bos-workspace runnig on port ${port}!`);
    })
    .on("error", (err: Error) => {
      log.error(err.message);
      process.exit(1);
    });

  if (opts.NoHot && io) {
    io.on("connection", () => {
      readJson(devJsonPath).then((devJson: DevJson) => {
        io?.emit("fileChange", devJson);
      })
        .catch((err: Error) => {
          log.error(err.stack || err.message);
        })
    });
  }

  return { io };
}


async function devServerWorkspace(opts: DevOptions) {
}

interface DevJson {
  components: Record<string, {
    code: string;
  }>;
  data: Record<string, any>;
};
async function generateDevJson(src: string, config: BaseConfig): Promise<DevJson> {
  let devJson: DevJson = { components: {}, data: {} };
  let devAccount = config.accounts?.dev || config.account || "dev-1234";

  // for each js and jsx in src/widget
  await loopThroughFiles(path.join(src, "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".js" && ext !== ".jsx") {
      return;
    }

    const widgetPath = path.relative(path.join(src, "widget"), file).replace(ext, "");
    const widgetKey = `${devAccount}/widget/${widgetPath.split("/").join(".")}`;

    // add to devJson.components
    devJson.components[widgetKey] = {
      code: await readFile(file, "utf-8"),
    }
  })


  return devJson;
}

function watchFolders() {
}

function generateAllDevJson() {
}


function injectHTML(html: string, injections: Record<string, string>) {
  Object.keys(injections).forEach((key) => {
    html = html.replace(`%${key}%`, injections[key]);
  });
  return html;
};
