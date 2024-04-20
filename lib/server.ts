import express, { Express } from 'express';
import http from 'http';
import { Server as IoServer } from "socket.io";
import { DevOptions } from '@/lib/dev'; // Update with the correct path to your server file
import { LogLevel, Logger } from "@/lib/logger";
import bodyParser from "body-parser";
import { exec } from "child_process";
import { existsSync, readJson, writeJson } from "fs-extra";
import { Gaze } from "gaze";
import path from "path";
import { buildApp } from "./build";
import { BaseConfig, readConfig } from "./config";
import { Network } from "./types";
import { loopThroughFiles, readFile } from "./utils/fs";
import { mergeDeep } from "./utils/objects";

/**
 * Creates the server for serving widgets and other assets
 * @param opts 
 * @param devJsonPath 
 */
export function createServer(opts: DevOptions, devJsonPath: string): Express {
  const app = express();
  const server = http.createServer(app);
  
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
        return res.status(500).send("Something went wrong.");
      })
  });

  // app.post("/rpc", async (req, res) => {
  //   log.debug(`RPC Request: ${JSON.stringify(req.body)}`);

  //   let json = {};

  //   // Forward the incoming request to the target rpc
  //   const response = await fetch("https://rpc.mainnet.near.org/", {
  //     method: req.method,
  //     headers: req.headers,
  //     body: req.body
  //   });

  //   if (!response.ok) {
  //     // Handle the error response
  //     log.error(`Error response: ${response.status}`);
  //     return res.status(response.status).send("Error hitting rpc.");
  //   }

  //   // Process the successful response
  //   json = await response.json();

  //   try {
  //     // Check if the request needs to be proxied
  //     if (
  //       req.params &&
  //       req.params.account_id === "social.near" &&
  //       req.params.method_name === "get"
  //     ) {
  //       log.debug(`Proxying request: ${JSON.stringify(req.params)}`);

  //       // Safely decode and parse args_base64
  //       try {
  //         const social_get_key = JSON.parse(atob(req.params.args_base64)).keys[0];

  //         readJson(devJsonPath).then((devJson: DevJson) => {
  //           const { components } = devJson;
  //           if (!components) {
  //             log.error(`No components found in devJson`);
  //             return res.status(500).send("No components found in devJson.");
  //           }
  //           // Modify the response if needed
  //           if (components[social_get_key]) {
  //             const social_get_key_parts = social_get_key.split("/");
  //             const devWidget = {};
  //             devWidget[social_get_key_parts[0]] = { widget: {} };
  //             devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] = components[social_get_key].code;
  //             json.result.result = Array.from(new TextEncoder().encode(JSON.stringify(devWidget)));
  //           }
  //           log.debug(`Returning something: ${JSON.stringify({})}`);
  //           res.json(json);
  //         }).catch((err: Error) => {
  //           log.error(err.stack || err.message);
  //           return res.status(500).send("Something went wrong with config map.");
  //         })
  //       } catch (e) {
  //         log.error(`Error decoding or processing args_base64: ${e.message}`);
  //         res.status(400).send("Invalid or corrupt args_base64.");
  //       }
  //     } else {
  //       // Send the original response if not proxied
  //       log.debug(`Returning original response`);
  //       res.json(json);
  //     }
  //   } catch (err) {
  //     // Handle errors
  //     log.error(err.stack || err.message);
  //     res.status(500).send("Something went wrong.");
  //   }
  // });

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

  return app;
};

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
    const widgetKey = `${devAccount}/widget/${widgetPath.split("/").join(".")}`;

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

