import path from "path";
import { buildApp } from "./build";
import { BaseConfig, readConfig } from "./config";
import { loopThroughFiles, readFile } from "./utils/fs";
import { Network } from "./types";
import { existsSync, writeJson, readJson } from "fs-extra";
import express from "express";
import http from "http";
import { Server as IoServer } from "socket.io";
import { exec } from "child_process";
import { Gaze } from "gaze";
import { mergeDeep } from "./utils/objects";

const DEV_DIST_FOLDER = "build";

// the gateway dist path in node_modules
const GATEWAY_PATH = path.join(__dirname, "../..", "gateway", "dist");

export type DevOptions = {
  port?: number;
  NoGateway?: boolean;
  NoHot?: boolean;
  NoOpen?: boolean;
  network?: Network;
  gateway?: string;
};

export async function dev(src: string, opts: DevOptions) {
  let config = await readConfig(path.join(src, "bos.config.json"), opts.network);
  const dist = path.join(src, DEV_DIST_FOLDER);
  const distDevJson = path.join(dist, "bos-loader.json");

  // 1. build app for the first time
  let devJson = await generateApp(src, dist, config, opts, distDevJson);
  await writeJson(distDevJson, devJson);

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
    devJson = await generateApp(src, dist, config, opts, distDevJson);
    await writeJson(distDevJson, devJson);

    if (io) {
      io.emit("fileChange", devJson);
    }

    return devJson
  });
}

export async function devMulti(root: string, srcs: string[], opts: DevOptions) {
  const dist = path.join(root, DEV_DIST_FOLDER);
  const distDevJson = path.join(dist, "bos-loader.json");
  let devJson = { components: {}, data: {} };

  // 1. build all apps for the first time
  for (const src of srcs) {
    const appDevJson = await generateApp(src, path.join(dist, path.relative(root, src)), await readConfig(path.join(src, "bos.config.json"), opts.network), opts, distDevJson);
    await writeJson(distDevJson, mergeDeep(devJson, appDevJson))
  };

  // 2. Start the server
  const { io } = startServer(opts, distDevJson);

  // 3. watch for changes in the srcs folder, rebuild apps on changes
  const watchPaths = srcs.map((src) => [path.join(src, "widget/**/*"), path.join(src, "module/**/*"), path.join(src, "ipfs/**/*"), path.join(src, "bos.config.json"), path.join(src, "aliases.json")]).flat();
  const gaze = new Gaze(watchPaths, { debounceDelay: 100 });

  // @ts-ignore
  gaze.on("all", async (_: string, file: string) => {
    const src = srcs.find((src) => file.includes(src));
    if (!src) {
      return;
    }
    log.info(`[${path.relative(src, file)}] changed: rebuilding app...`, LogLevels.DEV);
    const appDevJson = await generateApp(src, path.join(dist, path.relative(root, src)), await readConfig(path.join(src, "bos.config.json"), opts.network), opts, distDevJson);
    await writeJson(distDevJson, mergeDeep(devJson, appDevJson))
    if (io) {
      io.emit("fileChange", devJson);
    }
    return devJson
  });

};

async function generateApp(src: string, appDist: string, config: BaseConfig, opts: DevOptions, distDevJson: string): Promise<DevJson> {
  await buildApp(src, appDist, opts.network);
  return await generateDevJson(appDist, config);
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
    const GATEWAY_PATH = path.join(__dirname, "../..", "gateway", "dist");
    const gatewayPath = (opts.gateway && path.resolve(opts.gateway)) ?? GATEWAY_PATH;
    // let's check if gateway/dist/index.html exists
    if (!(existsSync(path.join(gatewayPath, "index.html")))) {
      log.error("Gateway not found. Skipping...");
      opts.NoGateway = true;
    } else {
      // everything else is redirected to the gateway/dist
      app.use((req, res, next) => {
        if (req.path === "/") {
          return next();
        }
        express.static(gatewayPath)(req, res, next);
      });
      app.get("*", (_, res) => {
        // Inject Gateway with Environment Variables
        readFile(
          path.join(gatewayPath, "index.html"),
          "utf8",
        ).then((data) => {
          const envConfig = JSON.stringify({
            bosLoaderWs: `ws://127.0.0.1:${port}`,
            bosLoaderUrl: `http://127.0.0.1:${port}/api/loader`,
            enableHotReload: opts.NoHot ? false : true,
            network: opts.network,
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
      log.success(`bos-workspace running on port ${port}!`);
    })
    .on("error", (err: Error) => {
      log.error(err.message);
      process.exit(1);
    });

  if (!opts.NoHot && io) {
    io.on("connection", (socket) => {
      log.info(`Socket connected: ${socket.id}`, LogLevels.DEV);
      socket.on("disconnect", () => {
        log.info(`Socket disconnected: ${socket.id}`, LogLevels.DEV);
      })
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
  await loopThroughFiles(path.join(src, "src", "widget"), async (file: string) => {
    const ext = path.extname(file);
    if (ext !== ".js" && ext !== ".jsx") {
      return;
    }

    const widgetPath = path.relative(path.join(src, "src", "widget"), file).replace(ext, "");
    const widgetKey = `${devAccount}/widget/${widgetPath.split(path.sep).join(".")}`;

    // add to devJson.components
    devJson.components[widgetKey] = {
      code: await readFile(file, "utf-8"),
    }
  })


  return devJson;

}

function injectHTML(html: string, injections: Record<string, string>) {
  Object.keys(injections).forEach((key) => {
    html = html.replace(`%${key}%`, injections[key]);
  });
  return html;
};

