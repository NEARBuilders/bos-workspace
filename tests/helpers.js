const mock = require("mock-fs");
const DIST_FOLDER = ".__test_dist__";
process.env.DIST_FOLDER = DIST_FOLDER;

const folders = {
  "./apps/testAppFolder": {
    "bos.config.json": JSON.stringify({
      appAccount: "test",
      aliases: {
        test: "testAlias",
        nui: "nui.near",
      },
    }),
    widget: {
      "test.js":
        'console.log("/*__@replace:test__*/");<Widget src="/*__@replace:nui__*//widget/index" />',
      "skip.js": '/*__@skip__*/console.log("Hello");/*__@replace:nui__*/',
    },
    "test.jsonc": "{}",
    "ignore.jsonc": "/*__@ignore__*/{}",
    "hello.txt": "Hello, World!",
    "donothing.json": "{hi: 1}",
  },
  "./modules": {
    "module1.js": "module1 content",
  },
  ["./" + DIST_FOLDER]: {}, // build folder
};

const mockFs = () => {
  mock(folders);
};
const restoreFs = () => {
  mock.restore();
};

module.exports = {
  mockFs,
  restoreFs,
  folders,
  DIST_FOLDER,
};
