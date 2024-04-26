import { buildApp } from "@/lib/build";
import { initProject } from "@/lib/init";
import { LogLevel, Logger } from "@/lib/logger";
import { Command } from "commander";
import path from "path";
import { dev } from "./dev";
import { cloneRepository } from "./repository";
import { buildWorkspace, devWorkspace } from "./workspace";
import { deploy } from "./deploy";

const program = new Command();

const [name, description, version] = [
  "bos-workspace",
  "Build decentralized apps",
  "0.0.1",
];


async function run() {
  program.name(name).description(description).version(version);

  program
    .command("dev")
    .description("Run the development server")
    .argument("[src]", "path to the app source code", ".")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)", "DEV")
    .option("-p, --port <port>", "Port to run the server on", "8080")
    .option("-g, --gateway <gateway>", "Path to custom gateway dist", undefined)
    .option("--no-gateway", "Disable the gateway", false)
    .option("--no-hot", "Disable hot reloading", false)
    .option("--no-open", "Disable opening the browser", false)
    .action((src, opts) => {
      global.log = new Logger(LogLevel[opts.loglevel.toUpperCase() as keyof typeof LogLevel]);
      dev(src, opts).catch((e: Error) => {
        log.error(e.stack || e.message);
      })
    });


  program
    .command("build")
    .description("Build the project")
    .argument("[src]", "path to the app source code", ".")
    .argument("[dest]", "destination path")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)", "BUILD")
    .action(async (src, dest, opts) => {
      dest = dest || path.join(src, "dist")
      global.log = new Logger(LogLevel[opts.loglevel.toUpperCase() as keyof typeof LogLevel]);
      await buildApp(src, dest, opts.network).catch((e: Error) => {
        log.error(e.stack || e.message);
      })
    });

  program
    .command("workspace")
    .alias("ws")
    .description("Work with multiple apps")
    .argument("[command]", "command to run")
    .argument("[src]", "path to the workspace", ".")
    .argument("[dest]", "destination path")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)")
    .option("-p, --port <port>", "Port to run the server on", "8080")
    .option("-g, --gateway <gateway>", "Path to custom gateway dist", undefined)
    .option("--no-gateway", "Disable the gateway", false)
    .option("--no-hot", "Disable hot reloading", false)
    .option("--no-open", "Disable opening the browser", false)
    .action(async (command, src, dest, opts) => {
      dest = dest || path.join(src, "dist")
      if (command === "build") {
        global.log = new Logger(LogLevel?.[opts?.loglevel?.toUpperCase() as keyof typeof LogLevel] || LogLevel.BUILD);
        await buildWorkspace(src, dest, opts.network).catch((e: Error) => {
          log.error(e.stack || e.message);
        });
      } else if (command === "dev") {
        global.log = new Logger(LogLevel?.[opts?.loglevel?.toUpperCase() as keyof typeof LogLevel] || LogLevel.DEV);
        await devWorkspace(src, opts).catch((e: Error) => {
          log.error(e.stack || e.message);
        });
      } else {
        log.error(`Unknown command: workspace ${command}`);
      }
    });

  program
    .command("init")
    .description("Initialize a new project")
    .argument("[path]", "where to init the project")
    .option("-t, --template <template>", "template to use (js-single, js-multi)", "js-single")
    .action(async (path, opts) => {
      if (!path) {
        log.error(`[path] argument is required`);
        log.log(`Usage example: init ./example\n`);
      }
      await initProject(path, opts.template);
    });

  program
    .command("clone")
    .description("Clone a SocialDB repository")
    .argument("[account]", "accountId")
    .argument("[dest]", "destination path")
    .action(async (account, dest) => {
      if (!account) {
        console.error("Error: Please provide an accountId.");
        return;
      }
      dest = dest || account;
      cloneRepository(account, dest);
    });

  program
    .command("pull")
    .description("Pull updates from a SocialDB repository")
    .argument("[account]", "accountId")
    .action(async (account: string | undefined) => {
      console.log("not yet supported");
      // pullRepository(account);
    });

  program
    .command("deploy")
    .description("Deploy the project")
    .argument("[appName]", "Workspace app name to deploy")
    .option("--deploy-account-id <deployAccountId>", "Account under which component code should be deployed")
    .option("--signer-account-id <signerAccountId>", "Account which will be used for signing deploy transaction, frequently the same as deploy-account-id")
    .option("--signer-public-key <signerPublicKey>", "Public key for signing transactions in the format: `ed25519:<public_key>`")
    .option("--signer-private-key <signerPrivateKey>", "Private key in `ed25519:<private_key>` format for signing transaction")
    .option("-n, --network <network>", "network to deploy for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)")
    .action(async (appName, opts) => {
      global.log = new Logger(LogLevel?.[opts?.loglevel?.toUpperCase() as keyof typeof LogLevel] || LogLevel.BUILD);
      await deploy(appName, opts).catch((e: Error) => {
        log.error(e.stack || e.message);
      })
    });

  program
    .command("upload")
    .description("Upload data to SocialDB (not implemented)")
    .argument("[string]", "app name")
    .action((appName) => {
      console.log("not yet supported");
    });

  program.parse();
}

export = {
  run,
};

