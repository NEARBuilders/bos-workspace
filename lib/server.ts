import { DevJson, DevOptions } from '@/lib/dev'; // Update with the correct path to your server file
import bodyParser from "body-parser";
import { exec } from "child_process";
import express from 'express';
import { existsSync, readJson } from "fs-extra";
import http from 'http';
import path from "path";
import { readFile } from "./utils/fs";

// the gateway dist path in node_modules
const GATEWAY_PATH = path.join(__dirname, "../..", "gateway", "dist");
export const RPC_URL = {
  mainnet: "https://rpc.mainnet.near.org/",
  testnet: "https://rpc.testnet.near.org/",
};

const SOCIAL_CONTRACT = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet",
}

/**
 * Starts the dev server
 * @param devJsonPath path to json redirect map
 * @param opts DevOptions
 * @returns http server
 */
export function startDevServer(devJsonPath: string, opts: DevOptions,): http.Server {
  const app = createApp(devJsonPath, opts);
  const server = http.createServer(app);
  startServer(server, opts);
  return server;
}
/*  */
/**
 * Creates the Express app for serving widgets and other assets
 * (separated out to enable endpoint testing)
 * @param opts 
 * @param devJsonPath 
 */
export function createApp(devJsonPath: string, opts: DevOptions): Express.Application {
  const app = express();

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

  app.use(bodyParser.json());

  app.get("/api/loader", (_, res) => {
    readJson(devJsonPath).then((devJson: DevJson) => {
      res.json(devJson);
    })
      .catch((err: Error) => {
        log.error(err.stack || err.message);
        return res.status(500).send("Error reading redirect map.");
      })
  });

  function proxyMiddleware(proxyUrl) {
    return async (req, res, next) => {
      let json = {};

      log.debug(`RPC Request: ${JSON.stringify(req.body)}`);

      try {
        // Make a request to the target rpc
        const response = await fetch(proxyUrl, {
          method: req.method,
          headers: req.headers,
          body: req.body,
        });
        // res.status(200).send(response);
        json = await response.json();
      } catch (err) {
        log.error(err.stack || err.message);
        res.status(500).send('Proxy request failed');
      };

      const { params } = req.body;

      if (
        params &&
        params.account_id === SOCIAL_CONTRACT[opts.network] &&
        params.method_name === "get"
      ) {
        const social_get_key = JSON.parse(atob(params.args_base64)).keys[0];

        log.debug(`RPC Request for key: ${social_get_key}`);

        const devComponents = await readJson(devJsonPath).then(
          (devJson: DevJson) => {
            return devJson.components;
          }).catch((err: Error) => {
            log.error(err.stack || err.message);
            return res.status(500).send("Error reading redirect map.");
          });
        if (devComponents[social_get_key]) {
          const social_get_key_parts = social_get_key.split("/");
          const devWidget = {};
          devWidget[social_get_key_parts[0]] = { widget: {} };
          devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] =
            devComponents[social_get_key].code;
          // @ts-ignore
          json.result.result = Array.from(
            new TextEncoder().encode(JSON.stringify(devWidget))
          );
        }
      }
      return res.status(200).send(json);
    };
  }

  app.all('/proxy-rpc', proxyMiddleware(RPC_URL[opts.network]));

  if (!opts.NoGateway) {
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
            bosLoaderWs: `ws://127.0.0.1:${opts.port}`,
            bosLoaderUrl: `http://127.0.0.1:${opts.port}/api/loader`,
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

  return app;
};

/**
 * Starts BosLoader Server and optionally opens gateway in browser
 * @param server http server
 * @param opts DevOptions
 */
export function startServer(server, opts) {
  server.listen(opts.port, "127.0.0.1", () => {
    if (!opts.NoGateway && !opts.NoOpen) {
      // open gateway in browser
      let start =
        process.platform == "darwin"
          ? "open"
          : process.platform == "win32"
            ? "start"
            : "xdg-open";
      start = process.env.WSL_DISTRO_NAME ? "explorer.exe" : start;
      exec(`${start} http://127.0.0.1:${opts.port}`);
    }
    log.log(`
  ┌─────────────────────────────────────────────────────────────┐
  │ BosLoader Server is Up and Running                          │
  │                                                             │${!opts.NoGateway
        ? `
  │ ➜ Local Gateway: \u001b[32mhttp://127.0.0.1:${opts.port}\u001b[0m                      │`
        : ""
      }
  │                                                             │
  │ ➜ RPC: \u001b[32mhttp://127.0.0.1:${opts.port}/rpc\u001b[0m         │
  │ ➜ Bos Loader Http: \u001b[32mhttp://127.0.0.1:${opts.port}/api/loader\u001b[0m         │${!opts.NoHot
        ? `
  │ ➜ Bos Loader WebSocket: \u001b[32mws://127.0.0.1:${opts.port}\u001b[0m                 │`
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
    log.success(`bos-workspace running on port ${opts.port}!`);
  })
    .on("error", (err: Error) => {
      log.error(err.message);
      process.exit(1);
    });
}

function injectHTML(html: string, injections: Record<string, string>) {
  Object.keys(injections).forEach((key) => {
    html = html.replace(`%${key}%`, injections[key]);
  });
  return html;
};

