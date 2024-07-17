import { buildApp } from "@/lib/build";
import { initProject } from "@/lib/init";
import { LogLevel, Logger } from "@/lib/logger";
import { Command } from "commander";
import { dev } from "./dev";
import { cloneRepository } from "./repository";
import { buildWorkspace, devWorkspace } from "./workspace";
import { deploy, deployAppData, DeployOptions } from "./deploy";

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
    .argument("[dest]", "destination path", "build")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)", "DEV")
    .option("-p, --port <port>", "Port to run the server on", "8080")
    .option("-g, --gateway <gateway>", "Path to custom gateway dist", true)
    .option("--no-gateway", "Disable the gateway")
    .option("--no-hot", "Disable hot reloading")
    .option("--no-open", "Disable opening the browser")
    .action((src, dest, opts) => {
      global.log = new Logger(LogLevel[opts.loglevel.toUpperCase() as keyof typeof LogLevel]);
      dev(src, dest, opts).catch((e: Error) => {
        log.error(e.stack || e.message);
      })
    });


  program
    .command("build")
    .description("Build the project")
    .argument("[src]", "path to the app source code", ".")
    .argument("[dest]", "destination path", "build")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)", "BUILD")
    .action(async (src, dest, opts) => {
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
    .argument("[dest]", "destination path", "build")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)")
    .option("-p, --port <port>", "Port to run the server on", "8080")
    .option("-g, --gateway <gateway>", "Path to custom gateway dist", true)
    .option("--no-gateway", "Disable the gateway")
    .option("--no-hot", "Disable hot reloading")
    .option("--no-open", "Disable opening the browser")
    .action(async (command, src, dest, opts) => {
      if (command === "build") {
        global.log = new Logger(LogLevel?.[opts?.loglevel?.toUpperCase() as keyof typeof LogLevel] || LogLevel.BUILD);
        await buildWorkspace(src, dest, opts.network).catch((e: Error) => {
          log.error(e.stack || e.message);
        });
      } else if (command === "dev") {
        global.log = new Logger(LogLevel?.[opts?.loglevel?.toUpperCase() as keyof typeof LogLevel] || LogLevel.DEV);
        await devWorkspace(src, dest, opts).catch((e: Error) => {
          log.error(e.stack || e.message);
        });
      } else {
        log.error(`Unknown command: workspace ${command}`);
      }
    });

  program
    .command("init")
    .description("Initialize a new project")
    .option("-p, --path <path>", "path to init project", ".")
    .option("-t, --template <template>", "template to use (js, ts etc.)", "js")
    .action(async (opts) => {
      await initProject(opts.path, opts.template);
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
    .description("Upload data to SocialDB")
    .argument("[string]", "app path")
    .option("-n, --network <network>", "network to deploy to", "mainnet")
		.option("--signerPublicKey <string>", "Signer public key")
  	.option("--signerPrivateKey <string>", "Signer private key")
  	.option("--deployAccountId <string>", "Deploy account id")
    .action(async (src, account, options) => {
			const deployOptions: DeployOptions = {
				signerPublicKey: options.signerPublicKey,
				signerPrivateKey: options.signerPrivateKey,
				network: options.network,
				deployAccountId: options.deployAccountId,
			};

			await deployAppData(src, deployOptions ).catch((e: Error) => {
				log.error(e.stack || e.message);
			})
    });

  program.parse();
}

export = {
  run,
};

