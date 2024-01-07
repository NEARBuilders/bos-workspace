import { readJsonSync } from "fs-extra";
import { Command } from "commander";
import { LogLevel, Logger } from "@/lib/logger";
import { buildApp } from "@/lib/build";

const program = new Command();

const [name, description, version] = [
  "bw",
  "Build decentralized apps",
  "0.0.1",
];

async function run() {
  program.name(name).description(description).version(version);
  //
  // program
  //   .command("dev")
  //   .description("Run the development server")
  //   .option("-p, --port <port>", "Port to run the server on", "8080")
  //   .option("-no-gateway", "Disable the gateway", false)
  //   .option("-no-hot", "Disable hot reloading", false)
  //   .option("-no-open", "Disable opening the browser", false)
  //   .action((opts) => {
  //     global.log = new Logger(LogLevel.DEV);
  //   });
  //
  //
  program
    .command("build")
    .description("Build the project")
    .argument("[path]", "path to the app")
    .argument("[dest]", "destination path", "./dest")
    .option("-n, --network <network>", "network to build for", "mainnet")
    .option("-l, --loglevel <loglevel>", "log level (ERROR, WARN, INFO, DEV, BUILD, DEBUG)", "BUILD")
    .action(async (src, dest, opts) => {
      global.log = new Logger(LogLevel[opts.loglevel.toUpperCase() as keyof typeof LogLevel]);
      await buildApp(src, dest, opts.network).catch((e: Error) => {
        log.error(e.stack || e.message);
      })
    });

  program
    .command("deploy")
    .description("Deploy the project (not implemented)")
    .argument("[string]", "app name")
    .action((appName) => {
    });
  program
    .command("upload")
    .description("Upload data to SocialDB (not implemented)")
    .argument("[string]", "app name")
    .action((appName) => {
    });

  program.parse();
}

export = {
  run,
};

