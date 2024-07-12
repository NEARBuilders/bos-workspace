import { DevJson, DevOptions, addApps } from '@/lib/dev';
import { fetchJson } from "@near-js/providers";
import bodyParser from "body-parser";
import { exec } from "child_process";
import express, { Request, Response } from 'express';
import { existsSync, readJson } from "fs-extra";
import http from 'http';
import path from "path";
import { fetchAndCacheContent, modifyIndexHtml } from './gateway';
import axios from 'axios';
import { readFile } from "./utils/fs";

// the gateway dist path in node_modules
const GATEWAY_PATH = path.join(__dirname, "../..", "gateway", "dist");

export const DEFAULT_GATEWAY_PATH = "https://ipfs.web4.near.page/ipfs/bafybeiftqwg2qdfhjwuxt5cjvvsxflp6ghhwgz5db3i4tqipocvyzhn2bq";

export const RPC_URL = {
  mainnet: "https://free.rpc.fastnear.com",
  testnet: "https://rpc.testnet.near.org",
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
export function startDevServer(srcs: string[], dists: string[], devJsonPath: string, opts: DevOptions): http.Server {
  const app = createApp(devJsonPath, opts);
  const server = http.createServer(app);
  startServer(server, opts, () => {
    const postData = JSON.stringify({ srcs: srcs.map((src) => path.resolve(src)), dists: dists.map((dist) => path.resolve(dist)) });
    const options = {
      hostname: '127.0.0.1',
      port: opts.port,
      path: `/api/apps`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    log.info(`Adding workspace to already existing dev server...`);
    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        log.info(`${data}`);
      });
    });

    req.on('error', (e) => {
      log.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
  });
  return server;
}

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

  app.options('*', (_, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    );
    res.sendStatus(200);
  });

  app.use(bodyParser.json());

  /**
   * Serves the loader json
   */
  app.get("/api/loader", (_, res) => {
    readJson(devJsonPath).then((devJson: DevJson) => {
      res.json(devJson);
    })
      .catch((err: Error) => {
        log.error(err.stack || err.message);
        return res.status(500).send("Error reading redirect map.");
      })
  });

  /**
   * Adds the loader json
   */
  app.post("/api/apps", (req, res) => {
    const srcs = req.body.srcs;
    const dists = req.body.dists;
    if (srcs.length != dists.length) {
      log.info("Number of apps don't match. Aborting.");
      return res.status(500).send("Error adding apps to dev server.");
    }

    log.info(`adding ${srcs} to watch list...`);
    addApps(srcs, dists).then(() => {
      log.info("New apps added successfully.");
      res.status(200).send("New apps added successfully.");
    }).catch((err: Error) => {
      log.error(err.stack || err.message);
      return res.status(500).send("Error adding apps to dev server.");
    });
  });

  function proxyMiddleware(proxyUrl: string) {
    return async (req: Request, res: Response, _) => {
      let json = {};

      log.debug(`RPC Request: ${JSON.stringify(req.body)}`);

      try {
        // Make a request to the target rpc
        json = await fetchJson(proxyUrl, JSON.stringify(req.body));

        log.debug(`RPC Response: ${json}`);
      } catch (err) {
        log.error(err.stack || err.message);
        return res.status(500).send('Proxy request failed');
      };

      if (!json) {
        return res.status(500).send('No response from proxy');
      }

      const { params } = req.body;

      if (
        params &&
        params.account_id === SOCIAL_CONTRACT[opts.network] &&
        params.method_name === "get"
      ) {
        const social_get_key = JSON.parse(atob(params.args_base64)).keys[0];

        log.debug(`Replace with local components for key: ${social_get_key}`);

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
      return res.status(200).json(json);
    };
  }

  /**
   * Proxy middleware for RPC requests
   * @param proxyUrl
   */
  app.all('/api/proxy-rpc', proxyMiddleware(RPC_URL[opts.network]));

  if (opts.gateway) { // Gateway setup, may be string or boolean

    /**
     * starts gateway from local path
     */
    const setupLocalGateway = async (gatewayPath: string) => {
      // if (!existsSync(path.join(gatewayPath, "/dist/index.html"))) {
      //   log.error("Gateway not found. Skipping...");
      //   opts.gateway = false;
      //   return;
      // }

      opts.gateway = gatewayPath;



      app.use(async (req, res) => {
        let manifest = { "entrypoints": ["runtime.690e8259ae304caef4f9.bundle.js", "main.c21c43cdd4b62c5173d8.bundle.js"] };

        // try {
        //   const response = await axios.get(`${gatewayPath}/asset-manifest.json`);
        //   manifest = response.data;
        //   log.debug(`Received manifest: ${JSON.stringify(manifest)}`);

        // } catch (error) {
        //   console.error("Error fetching asset manifest:", error);
        // }

        try { // forward requests to the web4 bundle
          const filePath = req.path;
          const ext = path.extname(filePath);
          if (ext === '.js' || ext === '.css') {
            gatewayPath += filePath;
            const content = await fetchAndCacheContent(gatewayPath);
            res.type(ext === '.js' ? 'application/javascript' : 'text/css');
            res.send(content);
          } else {
            readFile(path.join(__dirname, "../../gateway/public", "index.html"), "utf8")
              .then(async (data) => {
                let modifiedDist = await modifyIndexHtml(data, opts, manifest);
                res.type('text/html').send(modifiedDist);
              })
              .catch(err => {
                log.error(err);
                res.status(404).send("Something went wrong.");
              });
          }
        } catch (error) {
          log.error(`Error fetching content: ${error}`);
          res.status(404).send('Not found');
        }
      });
    };

    /**
     * starts gateway from remote url
     */
    const setupRemoteGateway = (url: string) => {
      app.use(async (req, res) => {
        try { // forward requests to the web4 bundle
          const filePath = req.path;
          const ext = path.extname(filePath);
          let fullUrl = url.replace(/\/$/, ''); // remove trailing slash

          if (ext === '.js' || ext === '.css') {
            fullUrl += filePath;
            const content = await fetchAndCacheContent(fullUrl);
            res.type(ext === '.js' ? 'application/javascript' : 'text/css');
            res.send(content);
          } else {
            fullUrl += "/index.html";
            let content = await fetchAndCacheContent(fullUrl);
            content = modifyIndexHtml(content, opts, {});
            res.type('text/html').send(content);
          }
        } catch (error) {
          log.error(`Error fetching content: ${error}`);
          res.status(404).send('Not found');
        }
      });
    };

    if (typeof opts.gateway === "string") { // Gateway is a string, could be local path or remote url
      if (opts.gateway.startsWith("http")) { // remote url (web4)
        const url = opts.gateway;

        setupRemoteGateway(url.replace(/\/$/, ''));
      } else { // local path
        setupLocalGateway(path.resolve(opts.gateway));
      }
    } else { // Gateway is boolean, setup default gateway
      setupLocalGateway(DEFAULT_GATEWAY_PATH);
    }
    log.success("Gateway setup successfully.");
  }

  return app;
};

/**
 * Starts BosLoader Server and optionally opens gateway in browser
 * @param server http server
 * @param opts DevOptions
 */
export function startServer(server, opts, sendAddApps) {
  server.listen(opts.port, "127.0.0.1", () => {
    if (opts.gateway && opts.open) {
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
  │                                                             │${opts.gateway
        ? `
  │ ➜ Local Gateway: \u001b[32mhttp://127.0.0.1:${opts.port}\u001b[0m                      │`
        : ""
      }
  │                                                             │
  │ ➜ Bos Loader Http: \u001b[32mhttp://127.0.0.1:${opts.port}/api/loader\u001b[0m         │${opts.hot
        ? `
  │ ➜ Bos Loader WebSocket: \u001b[32mws://127.0.0.1:${opts.port}\u001b[0m                 │`
        : ""
      }
  │ ➜ Proxy RPC: \u001b[32mhttp://127.0.0.1:${opts.port}/api/proxy-rpc\u001b[0m            │
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
    .on("error", async (err: any) => {
      if (err.code === "EADDRINUSE") {
        log.warn(err.message);
        sendAddApps();
      } else {
        log.error(err.message);
        process.exit(1);
      }
    });
}
