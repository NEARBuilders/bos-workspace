import { DevJson, DevOptions, addApps } from '@/lib/dev';
import { fetchJson } from "@near-js/providers";
import axios from 'axios';
import bodyParser from "body-parser";
import { exec } from "child_process";
import express, { NextFunction, Request, Response } from 'express';
import { readJson } from "fs-extra";
import http from 'http';
import httpProxy from 'http-proxy';
import * as https from 'https';
import path from "path";
import { modifyIndexHtml } from './gateway';
import * as fs from "./utils/fs";

const httpsAgent = new https.Agent({
  secureProtocol: 'TLSv1_2_method'
});

const proxy = httpProxy.createProxyServer({
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Proxy error');
});


export const DEFAULT_GATEWAY_URL = "https://ipfs.web4.near.page/ipfs/bafybeibe63hqugbqr4writdxgezgl5swgujay6t5uptw2px7q63r7crk2q/";

export const RPC_URL = {
  mainnet: "https://rpc.mainnet.near.org",
  testnet: "https://rpc.testnet.near.org",
};

const SOCIAL_CONTRACT = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet",
}

let modifiedHtml: string | null = null;
let gatewayInitPromise: Promise<void> | null = null;

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

        log.debug(`RPC Response: ${JSON.stringify(json)}`);
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

  if (opts.gateway) {
    let gatewayUrl = typeof opts.gateway === 'string' ? opts.gateway : DEFAULT_GATEWAY_URL;
    const isLocalPath = !gatewayUrl.startsWith('http');
    gatewayUrl = gatewayUrl.replace(/\/$/, ''); // remove trailing slash
    opts.gateway = gatewayUrl; // standardize to url string

    initializeGateway(gatewayUrl, isLocalPath, opts, devJsonPath);

    // Middleware to ensure gateway is initialized before handling requests
    app.use(async (req, res, next) => {
      if (gatewayInitPromise) {
        try {
          await gatewayInitPromise;
        } catch (error) {
          return next(error);
        }
      }
      next();
    });

    app.use(async (req, res, next) => {
      try {
        if (req.path === '/' || req.path === '/index.html') {
          // Serve the modified HTML
          res.type('text/html').send(modifiedHtml);
        } else if (path.extname(req.path) === '.js' || path.extname(req.path) === '.css') {
          // Proxy requests for JS and CSS files
          log.debug(`Request for: ${req.path}`);

          if (isLocalPath) {
            const fullUrl = path.join(__dirname, gatewayUrl, req.path);

            try {
              log.debug(`Attempting to serve file from local path: ${fullUrl}`);
              // Attempt to serve the file from the local path
              await fs.promises.access(fullUrl);
              res.sendFile(fullUrl);
            } catch (err) {
              if (err.code === 'ENOENT') {
                // File not found, continue to next middleware
                log.debug(`File not found: ${fullUrl}`);
                next();
              } else {
                // Other error, handle it
                next(err);
              }
            }
          } else {
            log.debug(`Proxying request to: ${gatewayUrl}${req.path}`);
            // Proxy the request to the remote gateway
            proxy.web(req, res, { target: `${gatewayUrl}${req.path}`, agent: httpsAgent });
          }
        } else {
          // what about images?
          // Do we need to express static local bundle if it references images or other assets?
          next();
        }
      } catch (error) {
        next(error);
      }
    });

    // To handle client side routing
    app.use('*', (req, res) => {
      res.type('text/html').send(modifiedHtml);
    });

    log.success("Gateway setup successfully.");
  }

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    log.error(`Error: ${err.message}`);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  return app;
};


function initializeGateway(gatewayUrl: string, isLocalPath: boolean, opts: DevOptions, devJsonPath: string) {
  gatewayInitPromise = setupGateway(gatewayUrl, isLocalPath, opts, devJsonPath)
    .then(() => {
      log.success("Gateway initialized successfully.");
    })
    .catch((error) => {
      log.error(`Failed to initialize gateway: ${error}`);
      throw error;
    });
}

async function setupGateway(gatewayUrl: string, isLocalPath: boolean, opts: DevOptions, devJsonPath: string) {
  log.debug(`Setting up ${isLocalPath ? "local " : ""}gateway: ${gatewayUrl}`);

  const manifestUrl = isLocalPath
    ? path.join(gatewayUrl, "/asset-manifest.json")
    : `${gatewayUrl}/asset-manifest.json`;

  try {
    log.debug(`Fetching manifest from: ${manifestUrl}`);
    const manifest = await fetchManifest(manifestUrl);

    log.debug(`Received manifest. Modifying HTML...`);
    const htmlContent = await fs.readFile(path.join(__dirname, '../../public/index.html'), 'utf8');

    const dependencies = manifest.entrypoints.map((entrypoint: string) => isLocalPath ? `${entrypoint}` : `${gatewayUrl}/${entrypoint}`);
    modifiedHtml = modifyIndexHtml(htmlContent, opts, dependencies);
    
    // log.debug(`Importing packages...`); <-- this used jpsm to create import map for wallet selector
    // modifiedHtml = await importPackages(modifiedHtml); // but didn't want it to run each time dev server started, so commented out

    // Write the modified HTML to the output path
    const outputDir = path.join(opts.output);
    const outputPath = path.join(outputDir, 'index.html');

    // Make sure the directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Write modified html
    await fs.promises.writeFile(outputPath, modifiedHtml);
    
    log.debug(`Modified HTML written to: ${outputPath}`);
  } catch (error) {
    log.error(`Error setting up gateway: ${error}`);
    throw error;
  }
}


async function fetchManifest(url: string): Promise<any> {
  try {
    if (url.startsWith('http')) {
      const response = await axios.get(url);
      return response.data;
    } else {
      return JSON.parse(await fs.readFile(url, 'utf8'));
    }
  } catch (error) {
    log.error(`Error fetching manifest from: ${url}`);
    throw new Error('Failed to fetch manifest');
  }
}


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
