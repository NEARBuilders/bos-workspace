const path = require("path");
const { generateDevJson } = require("../lib/dev");
const { mockFs, restoreFs } = require("./helpers");
const fs = require("fs");
const { build } = require("../lib/build");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

describe("generateDevJson", () => {
  test("generates the development JSON correctly", async () => {
    // mock a nested component
    fs.mkdirSync(
      path.join(".", "apps", "testAppFolder", "widget", "Layout", "Modal"),
      {
        recursive: true,
      },
    );
    fs.writeFileSync(
      path.join(
        ".",
        "apps",
        "testAppFolder",
        "widget",
        "Layout",
        "Modal",
        "index.jsx",
      ),
      'return console.log("/*__@replace:test__*/");<Widget src="/*__@replace:nui__*//widget/index" />',
    );

    // first, build the app
    await build();

    const devJson = generateDevJson("testAppFolder");

    // verify the structure of the devJson
    expect(devJson).toHaveProperty("components");
    expect(devJson).toHaveProperty("data");

    // verify the content of the component file
    expect(devJson.components["test/widget/Layout.Modal.index"].code).toEqual(
      'return console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
    expect(devJson.data).toEqual({
      test: {
        hello: "Hello, World!",
        test: "{}",
      },
    });
  });
});
