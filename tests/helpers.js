const mock = require("mock-fs");
const DIST_FOLDER = ".__test_dist__";
process.env.DIST_FOLDER = DIST_FOLDER;

const folders = {
  "./apps/testAppFolder": {
    "bos.config.json": JSON.stringify({
      appAccount: "test",
      overrides: {
        testnet: {
          appAccount: "testing.testnet"      
        }
      },
      aliases: {
        test: "testAlias",
        nui: "nui.near",
      },
    }),
    widget: {
      "test.js":
        'console.log("/*__@replace:test__*/");<Widget src="/*__@replace:nui__*//widget/index" />',
      "skip.js": '/*__@skip__*/console.log("Hello");/*__@replace:nui__*/',
      "test.jsonc":
        '/*__@noStringify__*/{"metadata":{"name":"every video","description":"A hub for every video indexed across the BOS.","image":{"ipfs_cid":"bafkreihi3qh72njb3ejg7t2mbxuho2vk447kzkvpjtmulsb2njd6m2cfgi"},"tags":{"app":"","video":"","livepeer":"","everything":""}}}',
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
