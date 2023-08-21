const mockFs = require("mock-fs");
const fs = require("fs");
const DIST_FOLDER = ".__test_dist__";
process.env.DIST_FOLDER = DIST_FOLDER;

const {
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
} = require("./lib.js");

// Before each test, set up the mock file system
beforeEach(() => {
  mockFs({
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
  });
});

// After each test, restore the original (real) file system
afterEach(() => {
  jest.clearAllMocks();
  mockFs.restore();
});

// after all tests, delete the build folder
afterAll(() => {
  // if (fs.existsSync(DIST_FOLDER))
  //   fs.rmdirSync(DIST_FOLDER, { recursive: true });
});

describe("readBosConfig", () => {
  it("reads the bos.config.json file correctly", () => {
    const config = readBosConfig("testAppFolder");
    expect(config).toEqual({
      appAccount: "test",
      aliases: { test: "testAlias", nui: "nui.near" },
    });
  });
});

describe("processCommentCommands", () => {
  it("processes the comment commands correctly", () => {
    const aliases = { test: "testAlias" };
    const appAccount = "testAccount";
    const fileContent =
      'console.log("/*__@replace:test__*/"); console.log("/*__@appAccount__*/");';
    const result = processCommentCommands(fileContent, aliases, appAccount);
    expect(result).toEqual(
      'console.log("testAlias"); console.log("testAccount");',
    );
  });

  it("returns original content when no aliases are found", () => {
    const aliases = { test: "testAlias" };
    const appAccount = "testAccount";
    const fileContent = 'console.log("Hello, World!");';
    const result = processCommentCommands(fileContent, aliases, appAccount);
    expect(result).toEqual('console.log("Hello, World!");');
  });
});

describe("importModules", () => {
  it("imports module content correctly", () => {
    const fileContent = 'console.log("/*__@import:module1__*/");';
    const result = importModules(fileContent);
    expect(result).toEqual('console.log("module1 content");');
  });

  it("throws an error when a module does not exist", () => {
    const fileContent = 'console.log("/*__@import:nonexistentModule__*/");';
    expect(() => importModules(fileContent)).toThrow();
  });
});

describe("shouldSkipFile", () => {
  it("identifies files that should be skipped", () => {
    expect(shouldSkipFile('console.log("Hello"); /*__@skip__*/')).toBeTruthy();
    expect(shouldSkipFile('console.log("Hello");')).toBeFalsy();
  });
});

describe("processFile", () => {
  it("processes a file correctly", () => {
    let spy = jest.spyOn(fs, "writeFileSync");
    processFile(
      "./apps/testAppFolder/widget/test.js",
      {
        test: "testAlias",
        nui: "nui.near",
      },
      "testAccount",
    );
    expect(spy).toHaveBeenCalledWith(
      "./apps/testAppFolder/widget/test.js",
      'console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
  });

  it("does not modify the file when it should be skipped", () => {
    let spy = jest.spyOn(fs, "writeFileSync");
    processFile(
      "./apps/testAppFolder/widget/skip.js",
      {
        test: "testAlias",
        nui: "nui.near",
      },
      "testAccount",
    );
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("processDistFolder", () => {
  it("processes an app folder correctly", async () => {
    const spy = jest.spyOn(fs, "writeFileSync");
    await generateDistFolder("testAppFolder");
    await processDistFolder("testAppFolder");
    expect(spy).toHaveBeenCalledWith(
      `./${DIST_FOLDER}/testAppFolder/src/test.js`,
      'console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
  });
});

describe("generateDistFolder", () => {
  it("generates the build folder structure correctly", () => {
    const spyc = jest.spyOn(fs, "copyFileSync");
    const spym = jest.spyOn(fs, "mkdirSync");
    generateDistFolder("testAppFolder");
    expect(spym).toHaveBeenCalledWith(DIST_FOLDER + "/testAppFolder", {
      recursive: true,
    });
    expect(spyc.mock.calls).toEqual([
      [
        "./apps/testAppFolder/widget/skip.js",
        "./" + DIST_FOLDER + "/testAppFolder/src/skip.js",
      ],
      [
        "./apps/testAppFolder/widget/test.js",
        "./" + DIST_FOLDER + "/testAppFolder/src/test.js",
      ],
    ]);
  });
});

describe("generateDataJson", () => {
  it("generates data.json file correctly", () => {
    const spy = jest.spyOn(fs, "writeFileSync");
    generateDataJson("testAppFolder");
    expect(spy.mock.calls[0][0]).toBe(DIST_FOLDER + "/testAppFolder/data.json");
    expect(spy.mock.calls[0][1].replace(/\s+/g, "")).toBe(
      '{"hello":"Hello,World!","test":"{}"}',
    );
  });
});

describe("generateDevJson", () => {
  it("generates the development JSON correctly", async () => {
    // mock a nested component
    fs.mkdirSync("./apps/testAppFolder/widget/Layout/Modal", {
      recursive: true,
    });
    fs.writeFileSync(
      "./apps/testAppFolder/widget/Layout/Modal/index.jsx",
      'return console.log("/*__@replace:test__*/");<Widget src="/*__@replace:nui__*//widget/index" />',
    );

    // first, build the app
    await generateDistFolder("testAppFolder");
    await processDistFolder("testAppFolder");
    await generateDataJson("testAppFolder");

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

// TODO: properly test the dev function
// describe("dev", () => {
//   it("executes the dev script correctly", async () => {
//     await dev();
//     setTimeout(() => {
//       throw "Force dev script to exit";
//     }, 3000);
//   });
// });

describe("build", () => {
  it("executes the build script correctly", async () => {
    const spyw = jest.spyOn(fs, "writeFileSync");
    const spyc = jest.spyOn(fs, "copyFileSync");
    const spym = jest.spyOn(fs, "mkdirSync");

    await build();
    expect(spym).toHaveBeenCalledWith(DIST_FOLDER + "/testAppFolder", {
      recursive: true,
    });
    expect(spyc).toHaveBeenCalledWith(
      "./apps/testAppFolder/widget/test.js",
      `./${DIST_FOLDER}/testAppFolder/src/test.js`,
    );
    expect(spyw).toHaveBeenCalledWith(
      `./${DIST_FOLDER}/testAppFolder/src/test.js`,
      'console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
    expect(spyw.mock.calls[spyw.mock.calls.length - 1][0]).toBe(
      DIST_FOLDER + "/testAppFolder/data.json",
    );
    expect(
      spyw.mock.calls[spyw.mock.calls.length - 1][1].replace(/\s+/g, ""),
    ).toBe('{"hello":"Hello,World!","test":"{}"}');
  });
});
