const fs = require("fs");
const path = require("path");
const http = require("http");
const chokidar = require("chokidar");
const ignore = require("ignore");
const chalk = require("chalk");

let filesJson = { components: {} };
let ig = ignore().add([".*/**", "**/.*", "node_modules", "**/node_modules/**"]);

if (fs.existsSync(".gitignore")) {
  ig.add(fs.readFileSync(".gitignore").toString());
}

const logWarning = (err) => {
  console.log(chalk.yellow.bold("Warning:"), chalk.yellow(err));
};

const getFilesRecursively = (folderPath, author, relativePath = "") => {
  const items = fs.readdirSync(folderPath, { withFileTypes: true });

  for (let item of items) {
    const fullPath = path.join(folderPath, item.name);
    const newRelativePath = path.join(relativePath, item.name);

    if (!ig.ignores(newRelativePath)) {
      if (item.isDirectory()) {
        getFilesRecursively(fullPath, author, newRelativePath);
      } else if (item.isFile() && path.extname(item.name) === ".jsx") {
        let modifiedRelativePath = newRelativePath.includes("src/")
          ? newRelativePath.split("src/")[1]
          : newRelativePath;
        let key =
          author +
          "/widget/" +
          modifiedRelativePath
            .replace(new RegExp(path.sep, "g"), ".")
            .slice(0, -4);

        let fileContent = fs.readFileSync(fullPath, "utf-8");
        filesJson.components[key] = { code: fileContent };
      }
    }
  }
};

const generateJson = () => {
  filesJson = { components: {} };

  const baseDir = ".";
  const items = fs.readdirSync(baseDir, { withFileTypes: true });

  for (let item of items) {
    const relativePath = path.join(baseDir, item.name);

    if (!ig.ignores(relativePath) && item.isDirectory()) {
      const configJsonPath = path.join(relativePath, "config.json");

      if (fs.existsSync(configJsonPath)) {
        const configJson = JSON.parse(fs.readFileSync(configJsonPath, "utf-8"));
        if (configJson.ignore === true) {
          continue;
        }
        const author = configJson.author;

        if (!author) {
          logWarning(
            `No valid author in config.json for ${relativePath}. Skipping this directory.`
          );
          continue;
        }

        const srcFolderPath = path.join(relativePath, "src");
        if (fs.existsSync(srcFolderPath)) {
          getFilesRecursively(
            srcFolderPath,
            author,
            path.join(item.name, "src")
          );
        } else {
          logWarning(
            `No 'src' directory found in ${relativePath}. Skipping this directory.`
          );
        }
      } else {
        logWarning(
          `No config.json file found in ${relativePath}. Skipping this directory.`
        );
      }
    }
  }
};

generateJson();

const server = http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify(filesJson, null, 2));
  })
  .listen(4040, "127.0.0.1", () => {
    console.log(
      chalk.green(
        "\n/--------------------------------------------\\\n|",
        "Server running at " +
          chalk.blue.underline.bold("http://127.0.0.1:4040/"),
        "|\n\\--------------------------------------------/\n"
      ),
      chalk.green(
        "\nTo access the local widgets, go to " +
          chalk.blue.underline.bold("https://near.org/flags") +
          " and add the following URL:\n" +
          chalk.blue.bold("http://127.0.0.1:4040/")
      ),
      chalk.green(
        "\n----------------------------------------------\n",
        "\nTo enable live refresh, use `yarn start` instead of `yarn dev`.\n",
        "\n----------------------------------------------\n"
      )
    );
  });

const WebSocket = require("ws");

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

chokidar.watch(".", { ignoreInitial: true }).on("all", (event, filePath) => {
  if (!ig.ignores(filePath)) {
    console.log(
      chalk.green.bold(`\n - File change detected. Regenerating the JSON...`)
    );
    generateJson();

    // Broadcast refresh to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("refresh");
      }
    });
  }
});
