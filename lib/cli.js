const { deploy_app, deploy_data } = require("./deploy");
const { version, name, description } = require("../package.json");
const { Command } = require("commander");
const fs = require("fs");
const readline = require("readline");

const program = new Command();

const { build_with_log } = require("./build.js");
const { dev } = require("./dev.js");

async function run() {
  program.name(name).description(description).version(version);

  program
    .command("dev")
    .description("Run the development server")
    .option("-p, --port <port>", "Port to run the server on", "8080")
    .option("-no-gateway", "Disable the gateway", false)
    .option("-no-hot", "Disable hot reloading", false)
    .option("-no-open", "Disable opening the browser", false)
    .action((opts) => {
      dev(opts).catch((err) => {
        console.error(err);
        process.exit(1);
      });
    });
  program
    .command("build")
    .description("Build the project")
    .action(() => {
      build_with_log().catch(console.error);
    });
  program
    .command("deploy")
    .description("Deploy the project")
    .argument('[string]', 'app name')
    .action((appName) => {
      deployCLI(appName);
    });
  program
    .command("upload")
    .description("Upload data to SocialDB")
    .argument('[string]', 'app name')
    .action((appName) => {
      uploadDataCLI(appName);
    });

  program.parse();
}

function deployCLI(appName) {
  appSelectorCLI(deploy_app, appName);
}

function uploadDataCLI(appName) {
  appSelectorCLI(deploy_data, appName);
}

function appSelectorCLI(callback, specifiedAppFolder) {
  const appFolders = fs.readdirSync("./apps");

  // Check if appFolder is provided as a command line argument
  if (specifiedAppFolder) {
    if (appFolders.includes(specifiedAppFolder)) {
      callback(specifiedAppFolder);
      return;
    }
    console.error("Invalid app name specified.");
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
