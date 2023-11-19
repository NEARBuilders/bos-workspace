/* *
 * Handle the JSON, Text data under apps
 * */

const { read_bos_config } = require("./config");
const {
  processCommentCommands,
  ignoreFiles,
  noStringifyJsonFiles,
  removeComments,
} = require("./parse");
const { for_rfile } = require("./utils");
const fs = require("fs");
const path = require("path");

const distFolder = process.env.DIST_FOLDER || "build";

// generate data.json file
function generate_data_json(appFolder) {
  const data = {};
  const config = read_bos_config(appFolder);

  for_rfile(path.join(".", "apps", appFolder), ["jsonc", "txt"], (file) => {
    let fileContent = fs.readFileSync(file, "utf8");
    file = path.basename(file);
    if (ignoreFiles(fileContent)) return;
    if (file.endsWith(".jsonc")) {
      // If it's a JSONC file and has the noStringify marker, parse the content
      // Otherwise, just remove comments and spaces as before
      // first process comment commands
      fileContent = processCommentCommands(
        fileContent,
        config.aliases,
        config.appAccount,
      );
      if (noStringifyJsonFiles(fileContent)) {
        fileContent = JSON.parse(removeComments(fileContent));
      } else {
        fileContent = removeComments(fileContent).replace(/\s/g, ""); // remove comments and spaces
      }
    }
    const keys = file.replace(`./apps/${appFolder}/`, "").split("/");
    // remove file extension
    keys[keys.length - 1] = keys[keys.length - 1]
      .split(".")
      .slice(0, -1)
      .join(".");
    keys.reduce((obj, key, i) => {
      if (i === keys.length - 1) {
        if (typeof fileContent === "object") {
          obj[key] = { ...obj[key], ...fileContent }; // merge if object
        } else {
          obj[key] = fileContent;
        }
      } else {
        if (!obj[key]) obj[key] = {}; // if the key doesn't exist yet, create an object
      }
      return obj[key];
    }, data);
  });

  const dataPath = path.join(".", distFolder, appFolder, "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
module.exports = {
  generate_data_json,
};
