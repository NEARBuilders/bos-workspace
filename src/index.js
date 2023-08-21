#!/usr/bin/env node

const { version, name, description } = require("../package.json");
const { Command } = require("commander");
const program = new Command();

const { dev, build, deployCLI, uploadDataCLI } = require("./lib.js");

program.name(name).description(description).version(version);

program
  .command("dev")
  .description("Run the development server")
  .action(() => {
    dev().catch(console.error);
  });
program
  .command("build")
  .description("Build the project")
  .action(() => {
    build().catch(console.error);
  });
program
  .command("deploy")
  .description("Deploy the project")
  .action(() => {
    deployCLI();
  });
program
  .command("upload")
  .description("Upload data to SocialDB")
  .action(() => {
    uploadDataCLI();
  });

program.parse();