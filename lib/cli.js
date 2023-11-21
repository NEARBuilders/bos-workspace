const { deploy_app, deploy_data } = require("./deploy");
const { version, name, description } = require("../package.json");
const { Command } = require("commander");
const fs = require("fs");
const readline = require("readline");

const program = new Command();

const { build } = require("./build.js");
const { dev } = require("./dev.js");

async function run() {
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
}

function deployCLI() {
  appSelectorCLI(deploy_app);
}

function uploadDataCLI() {
  appSelectorCLI(deploy_data);
}

function appSelectorCLI(callback) {
  const appFolders = fs.readdirSync("./apps");

  // Check if appFolder is provided as a command line argument
  const specifiedAppFolder = process.argv[2];

  if (specifiedAppFolder && appFolders.includes(specifiedAppFolder)) {
    callback(specifiedAppFolder);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Please select an app:");
  appFolders.forEach((folder, index) => {
    console.log(`${index + 1}. ${folder}`);
  });

  rl.question("Enter the number of the app you want to use: ", (answer) => {
    const appIndex = parseInt(answer, 10) - 1;
    if (appIndex >= 0 && appIndex < appFolders.length) {
      const appFolder = appFolders[appIndex];
      callback(appFolder);
      rl.close();
    } else {
      console.error("Invalid selection. Exiting.");
      rl.close();
    }
  });
}

module.exports = {
  run,
};
