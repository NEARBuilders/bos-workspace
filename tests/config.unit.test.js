const { read_bos_config } = require("../lib/config");
const { mockFs, restoreFs } = require("./helpers");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

test("reads the bos.config.json file correctly", () => {
  const config = read_bos_config("testAppFolder");
  expect(config).toEqual({
    appAccount: "test",
    // version: "0.1.0",
    aliases: { test: "testAlias", nui: "nui.near" },
  });
});
