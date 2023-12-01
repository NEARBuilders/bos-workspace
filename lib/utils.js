const fs = require("fs");
const { glob } = require("glob");
const path = require("path");

/**
 * Loop through all the folders in the specified folder and run the callback if provided, and return the folders
 * @param {string} folder
 * @param {function} fn
 * @returns {string[]} folders
 */
function for_folder(folder, fn) {
  try {
    const folders = fs
      .readdirSync(folder)
      .map((file) => path.join(folder, file));
    if (fn) {
      for (const folder of folders) {
        fn(folder);
      }
    }
    return folders;
  } catch (error) {
    process.stderr.write(`Error reading folder: ${folder}\n${error}`);
    return [];
  }
}

/**
 * Loop through all the files in the specified folder and run the callback if provided, and return the files
 * @param {string} folder
 * @param {function} fn
 * @param {string[]} extensions
 * @returns {string[]} files as path object
 */

function for_rfile(folder, extensions, fn) {
  try {
    let files;
    if (extensions) {
      files = glob.sync(`${folder}/**/*.{${extensions.join(",")}}`, {
        windowsPathsNoEscape: true,
      });
    } else {
      files = glob.sync(`${folder}/**/*`, {
        windowsPathsNoEscape: true,
      });
    }
    files = files.map((file) => path.join(file));
    if (fn) {
      for (const file of files) {
        fn(file);
      }
    }
    return files;
  } catch (error) {
    process.stderr.write(`Error reading folder: ${folder}\n${error}`);
    return [];
  }
}

/**
 * Creates the dist folder for the {appName} app, and copies all the widget files to it
 * @param {string} appFolder
 * @param {string} distFolder
 */
function create_dist(appName, distFolder) {
  const distPath = path.join(".", distFolder, appName);
  try {
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true });
    }
    fs.mkdirSync(distPath, { recursive: true });
  } catch (error) {
    process.stderr.write(`Error creating folder: ${distPath}\n${error}`);
  }

  for_rfile(
    path.join(".", "apps", appName, "widget"),
    ["js", "jsx", "ts", "tsx"],
    (file) => {
      try {
        let distFilePath = path.join(
          distPath,
          path.relative(path.join(".", "apps", appName), file),
        );
        distFilePath = distFilePath.replace(
          path.join(distPath, "widget"),
          path.join(distPath, "src"),
        );

        if (!fs.existsSync(path.dirname(distFilePath))) {
          fs.mkdirSync(path.dirname(distFilePath), { recursive: true });
        }
        fs.copyFileSync(file, distFilePath);
      } catch (error) {
        process.stderr.write(`Error copying file: ${file}\n${error}`);
      }
    },
  );

  return distPath;
}

const log = {
  loading: (text = "", enabledots = true) => {
    let x = 0;
    const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const dots = [
      "   ",
      "   ",
      ".  ",
      ".  ",
      ".  ",
      ".. ",
      ".. ",
      ".. ",
      "...",
      "...",
      "...",
    ];
    const delay = 80;

    const interval = setInterval(function () {
      // change dots slower than the chars
      process.stdout.write(
        "\r" +
          chars[x++] +
          " " +
          text +
          (enabledots ? dots[x % dots.length] : ""),
      );
      x = x % chars.length;
    }, delay);

    return {
      finish: (text1 = text) => {
        clearInterval(interval);
        process.stdout.write(
          "\r\x1b[32m\x1b[1m\u2713\x1b[0m " +
            text1 +
            "                                      \n",
        );
      },
      error: (text1 = text) => {
        clearInterval(interval);
        process.stdout.write(
          "\r\x1b[31m\x1b[1m\u2717\x1b[0m " +
            text1 +
            "                                      \n",
        );
      },
    };
  },
  error: (text) => {
    process.stdout.write("\x1b[31m\x1b[1m\u2717\x1b[0m " + text + "\n");
  },
  info: (text) => {
    process.stdout.write("\x1b[34m\x1b[1m⋅\x1b[0m " + text + "\n");
  },
  log: (text) => {
    process.stdout.write(text + "\n");
  },
};

module.exports = {
  create_dist,
  for_rfile,
  for_folder,
  log,
};
