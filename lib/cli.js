const {
  deploy_app,
  deploy_data,
  deploy_data_with_metadata,
} = require("./deploy");
const { pull, clone, remove } = require("./repository");
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
    .option("--no-gateway", "Disable the gateway", false)
    .option("--no-hot", "Disable hot reloading", false)
    .option("--no-open", "Disable opening the browser", false)
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
    .argument("[app_name]", "app name")
    .action((appName) => {
      deployCLI(appName);
    });
  program
    .command("attest")
    .description("Deploy the project with metadata")
    .argument("[app_name]", "app name")
    .argument("[version]", "version")
    .action((appName) => {
      deployCLIMetadata(appName);
    });
  program
    .command("upload")
    .description("Upload data to SocialDB")
    .argument("[app_name]", "app name")
    .action((appName) => {
      uploadDataCLI(appName);
    });
  program
    .command("clone")
    .description("Download all the components from an account")
    .argument("[account_id]", "accountId")
    .action((accountId) => {
      cloneDataCLI(accountId);
    });
  program
    .command("pull")
    .description(
      "Sync origin with all the new or modified components from an account",
    )
    .argument("[account_id]", "accountId")
    .action((accountId) => {
      pull(accountId);
    });
  program
    .command("remove")
    .description("Delete downloaded components from an account")
    .argument("[account_id]", "accountId")
    .action((accountId) => {
      remove(accountId);
    });

  program.parse();
}

function deployCLI(appName) {
  appSelectorCLI(deploy_app, appName);
}

function deployCLIMetadata(appName, version) {
  appSelectorCLI(deploy_data_with_metadata, appName, version);
}

function uploadDataCLI(appName) {
  appSelectorCLI(deploy_data, appName);
}

function cloneDataCLI(accountId) {
  cloneAppSelectorCLI(clone, accountId);
}

function getAppFolders() {
  const dir = "./apps";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  }

  return fs.readdirSync(dir);
}

function cloneAppSelectorCLI(callback, accountId) {
  const appFolders = getAppFolders();

  if (accountId) {
    if (appFolders.includes(accountId)) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        "This app already exists. Do you want to overwrite it? [Y/n] ",
        (answer) => {
          if (answer.toLowerCase() == "y" || answer.toLowerCase() == "yes") {
            callback(accountId);
            rl.close();
          } else {
            console.error("The action has been cancelled.");
            rl.close();
          }
        },
      );

      return;
    } else {
      callback(accountId);
    }
  }
}

function appSelectorCLI(callback, specifiedAppFolder) {
  const appFolders = getAppFolders();

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
