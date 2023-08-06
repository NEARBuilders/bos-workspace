const distFolder = process.env.DIST_FOLDER || "build";
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const chokidar = require("chokidar");
const express = require("express");
const { execSync } = require("child_process");
const readline = require("readline");

// read bos.config.json from app folders
function readBosConfig(appFolder) {
  const configPath = path.join("./apps", appFolder, "bos.config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`bos.config.json not found in ${appFolder}`);
  }
  const configRaw = fs.readFileSync(configPath);
  try {
    JSON.parse(configRaw);
  } catch (e) {
    throw new Error(`${appFolder}/bos.config.json is not a valid json file`);
  }
  const config = JSON.parse(configRaw);
  if (!config.appAccount) {
    console.warn(
      `WARNING: appAccount not found in ${appFolder}/bos.config.json, build script may work but dev requires it`,
    );
  }
  return config;
}

// process comment commands and replace content in files
function processCommentCommands(fileContent, aliases, appAccount) {
  // Process the aliases
  for (let alias in aliases) {
    let replacePattern = new RegExp(`/\\*__@replace:${alias}__\\*/`, "g");
    fileContent = fileContent.replace(replacePattern, aliases[alias]);
  }

  // Replace the appAccount
  let accountPattern = /\/\*__@appAccount__\*\//g;
  fileContent = fileContent.replace(accountPattern, appAccount);

  return fileContent;
}

// import modules from /modules folder
function importModules(fileContent) {
  let importPattern = /\/\*__@import:(.+?)__\*\//g;
  let match;

  while ((match = importPattern.exec(fileContent)) !== null) {
    let modulePath = path.join("./modules", `${match[1]}.js`);
    let moduleContent = fs.readFileSync(modulePath, "utf8");
    fileContent = fileContent.replace(match[0], moduleContent);
  }

  return fileContent;
}

// skip files
function shouldSkipFile(fileContent) {
  let skipPattern = /\/\*__@skip__\*\//;
  return skipPattern.test(fileContent);
}

// process each file
function processFile(filePath, aliases, appAccount) {
  let fileContent = fs.readFileSync(filePath, "utf8");

  if (shouldSkipFile(fileContent)) return;

  fileContent = processCommentCommands(fileContent, aliases, appAccount);
  fileContent = importModules(fileContent);

  fs.writeFileSync(filePath, fileContent);
}

// walk through each app folder
function processDistFolder(appFolder) {
  const files = glob.sync(
    `./${distFolder}/${appFolder}/**/*.{js,jsx,ts,tsx,jsonc}`,
  );

  const config = readBosConfig(appFolder);

  files.forEach((file) => processFile(file, config.aliases, config.appAccount));
}

// generate the dist folder structure
function generateDistFolder(appFolder) {
  const distPath = path.join(`./${distFolder}`, appFolder);
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
  }
  fs.mkdirSync(distPath, { recursive: true });

  const files = glob.sync(`./apps/${appFolder}/widget/**/*.{js,jsx,ts,tsx}`);
  files.forEach((file) => {
    const distFilePath = file
      .replace(appFolder + "/widget", appFolder + "/src")
      .replace("./apps", `./${distFolder}`);
    if (!fs.existsSync(path.dirname(distFilePath))) {
      fs.mkdirSync(path.dirname(distFilePath), { recursive: true });
    }
    fs.copyFileSync(file, distFilePath);
  });
}

// ignore files
function ignoreFiles(fileContent) {
  let ignorePattern = /\/\*__@ignore__\*\//;
  return ignorePattern.test(fileContent);
}

// generate data.json file
function generateDataJson(appFolder) {
  const data = {};
  const files = glob.sync(`./apps/${appFolder}/**/*.{jsonc,txt}`);

  files.forEach((file) => {
    let fileContent = fs.readFileSync(file, "utf8");
    if (ignoreFiles(fileContent)) return;
    const keys = file.replace(`./apps/${appFolder}/`, "").split("/");
    // if jsonc file, remove comments and spaces
    if (file.endsWith(".jsonc")) {
      fileContent = fileContent.replace(/\/\/.*/g, "").replace(/\s/g, "");
    }
    keys[keys.length - 1] = keys[keys.length - 1].split(".")[0]; // remove file extension
    keys.reduce((obj, key, i) => {
      if (i === keys.length - 1) {
        obj[key] = fileContent; // assign the file content to the final key
      } else {
        if (!obj[key]) obj[key] = {}; // if the key doesn't exist yet, create an object
      }
      return obj[key];
    }, data);
  });

  const dataPath = path.join(`./${distFolder}`, appFolder, "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// generate the development json from the apps widgets
function generateDevJson(appFolder) {
  let devJson = { components: {} };
  const appConfig = readBosConfig(appFolder);
  if (!appConfig.appAccount) {
    return devJson;
  }
  const widgetFiles = glob.sync(
    `./${distFolder}/${appFolder}/src/**/*.{js,jsx,ts,tsx}`,
  );

  widgetFiles.forEach((file) => {
    let fileContent = fs.readFileSync(file, "utf8");
    let widgetPath = file
      .replace(`./${distFolder}/${appFolder}/src/`, "")
      .replace(path.extname(file), "");
    let widgetKey = `${appConfig.appAccount}/widget/${widgetPath
      .split(path.sep)
      .join(".")}`;
    devJson.components[widgetKey] = { code: fileContent };
  });

  return devJson;
}

// watch for changes in the specified folders and run the callback
function watchFolders(folders, callback) {
  const watcher = chokidar.watch(folders, { persistent: true });

  watcher.on("change", (path) => {
    callback(path);
  });
}

// serves the development json
function serveDevJson() {
  const app = express();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    );

    next();
  });

  app.get("/", (req, res) => {
    let devJson = { components: {} };
    const appFolders = fs.readdirSync("./apps");

    for (const appFolder of appFolders) {
      let appDevJson = generateDevJson(appFolder);
      devJson.components = { ...devJson.components, ...appDevJson.components };
    }

    res.json(devJson);
  });

  app.listen(4040, "127.0.0.1", () => {
    console.log(
      "\n|--------------------------------------------\\\n|",
      "Server running at " + "http://127.0.0.1:4040/" + "\n|\n|",
      "To use the local widgets, go to " + "https://near.org/flags" + "\n|",
      "and paste the server link above.\n|",
      "--------------------------------------------\\\n",
    );
  });
}

function deployCLI() {
  const appFolders = fs.readdirSync("./apps");

  // Check if appFolder is provided as a command line argument
  const specifiedAppFolder = process.argv[2];

  if (specifiedAppFolder && appFolders.includes(specifiedAppFolder)) {
    deployApp(specifiedAppFolder);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Please select an app to deploy:");
  appFolders.forEach((folder, index) => {
    console.log(`${index + 1}. ${folder}`);
  });

  rl.question("Enter the number of the app you want to deploy: ", (answer) => {
    const appIndex = parseInt(answer, 10) - 1;
    if (appIndex >= 0 && appIndex < appFolders.length) {
      const appFolder = appFolders[appIndex];
      deployApp(appFolder);
      rl.close();
    } else {
      console.error("Invalid selection. Exiting.");
      rl.close();
    }
  });
}

// TODO: need tests
function deployApp(appFolder) {
  const config = readBosConfig(appFolder);
  const appAccount = config.appAccount;

  if (!appAccount) {
    console.error(
      `App account is not defined for ${appFolder}. Skipping deployment.`,
    );
    return;
  }

  const command = `bos components deploy "${appAccount}" sign-as "${appAccount}" network-config mainnet`;

  try {
    const output = execSync(command, {
      cwd: path.join(distFolder, appFolder),
      stdio: "inherit",
    }).toString();
    console.log(`Deployed ${appFolder} widgets:\n${output}`);
  } catch (error) {
    console.error(`Error deploying ${appFolder} widgets:\n${error.message}`);
  }
}

// Main function to orchestrate the dev script
async function dev() {
  // the first build,
  await build();

  // Start serving the development JSON
  serveDevJson();

  setTimeout(() => {
    console.log("\nWatching for changes in the following folders");
    console.log(["./apps", "./modules"].join("\n"), "\n");
  }, 1000);
  watchFolders(["./apps", "./modules"], async (path) => {
    console.log(`\nChange detected in ${path}`);
    await build();
    console.log("Completed build successfully");
  });
}

// Main function to orchestrate the build script
async function build() {
  const appFolders = fs.readdirSync("./apps");

  for (const appFolder of appFolders) {
    console.log(`Building ${appFolder}...`);
    generateDistFolder(appFolder);
    processDistFolder(appFolder);
    generateDataJson(appFolder);
  }
}

// exports
module.exports = {
  readBosConfig,
  processCommentCommands,
  importModules,
  shouldSkipFile,
  processFile,
  processDistFolder,
  generateDistFolder,
  generateDataJson,
  generateDevJson,
  build,
  dev,
  deployCLI,
  deployApp,
};
