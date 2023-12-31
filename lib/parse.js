const fs = require("fs");
const path = require("path");
const sucrase = require("sucrase");

const sucraseOptions = {
  transforms: ["typescript", "jsx"],
  jsxRuntime: "preserve",
  enableLegacyBabel5ModuleInterop: true, // Preserve CommonJS import/export statements
  disableESTransforms: true,
};

// process each file
function process_file(filePath, { aliases, appAccount }) {
  let fileContent = fs.readFileSync(filePath, "utf8");

  if (shouldSkipFile(fileContent)) return;

  fileContent = processCommentCommands(fileContent, aliases, appAccount);
  fileContent = importModules(fileContent);

  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    fileContent = transpileTypescript(fileContent);
    // remove and replace the .old tsx file with the new jsx file
    const newFilePath = filePath.replace(".ts", ".js").replace(".tsx", ".jsx");
    fs.unlinkSync(filePath);
    filePath = newFilePath;
  }

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

// transpile typescript files to valid BOS Lang
const transpileTypescript = (fileContent) => {
  const transpiledCode = sucrase.transform(fileContent, sucraseOptions).code;

  // replace the default export statement
  fileContent = transpiledCode.replace(
    /export\s+default\s+(\w+);/,
    "return $1(props);",
  );

  return fileContent;
};

const ignoreFiles = (c) => /\/\*__@ignore__\*\//.test(c);

// no stringify json files
const noStringifyJsonFiles = (c) => /\/\*__@noStringify__\*\//.test(c);

const removeComments = (c) =>
  c.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, "").trim();

/*
 * Injects the HTML with the given injections
 * @param {string} html
 * @param {object} injections
 * @returns {string} html
 *
 * Example:
 * const html = "<div>%title%</div>";
 * const injections = { title: "Hello World" };
 * const injectedHtml = injectHTML(html, injections);
 * console.log(injectedHtml); // <div>Hello World</div>
 */

const injectHTML = (html, injections) => {
  Object.keys(injections).forEach((key) => {
    html = html.replace(`%${key}%`, injections[key]);
  });
  return html;
};

module.exports = {
  processCommentCommands,
  process_file,
  importModules,
  shouldSkipFile,
  ignoreFiles,
  noStringifyJsonFiles,
  removeComments,
  injectHTML,
};
