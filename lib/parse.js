const fs = require("fs");
const path = require("path");

// process each file
function process_file(filePath, { aliases, appAccount }) {
  let fileContent = fs.readFileSync(filePath, "utf8");

  if (shouldSkipFile(fileContent)) return;

  fileContent = processCommentCommands(fileContent, aliases, appAccount);
  fileContent = importModules(fileContent);

  fs.writeFileSync(filePath, fileContent);
}

const shouldSkipFile = (c) => /\/\*__@skip__\*\//.test(c);

// process comment commands and replace content in files
const processCommentCommands = (fileContent, aliases, appAccount) => {
  // Process the aliases
  if (aliases) {
    for (let alias in aliases) {
      let replacePattern = new RegExp(`/\\*__@replace:${alias}__\\*/`, "g");
      fileContent = fileContent.replace(replacePattern, aliases[alias]);
    }
  }

  // Replace the appAccount
  if (appAccount) {
    let accountPattern = /\/\*__@appAccount__\*\//g;
    fileContent = fileContent.replace(accountPattern, appAccount);
  }

  return fileContent;
};

// import modules from /modules folder
const importModules = (fileContent) => {
  let importPattern = /\/\*__@import:(.+?)__\*\//g;
  let match;

  while ((match = importPattern.exec(fileContent)) !== null) {
    let modulePath = path.join("./modules", `${match[1]}.js`);
    let moduleContent = fs.readFileSync(modulePath, "utf8");
    fileContent = fileContent.replace(match[0], moduleContent);
  }

  return fileContent;
};

const ignoreFiles = (c) => /\/\*__@ignore__\*\//.test(c);

// no stringify json files
const noStringifyJsonFiles = (c) => /\/\*__@noStringify__\*\//.test(c);

const removeComments = (c) =>
  c.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();

module.exports = {
  processCommentCommands,
  process_file,
  importModules,
  shouldSkipFile,
  ignoreFiles,
  noStringifyJsonFiles,
  removeComments,
};
