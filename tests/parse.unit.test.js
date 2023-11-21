const {
  shouldSkipFile,
  importModules,
  process_file,
  processCommentCommands,
  ignoreFiles,
  noStringifyJsonFiles,
  removeComments,
} = require("../lib/parse");
const { mockFs, restoreFs } = require("./helpers");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

describe("shouldSkipFile", () => {
  test("identifies files that should be skipped", () => {
    expect(shouldSkipFile('console.log("Hello"); /*__@skip__*/')).toBeTruthy();
    expect(shouldSkipFile('console.log("Hello");')).toBeFalsy();
  });
});

describe("ignoreFiles", () => {
  test("identifies files that should be ignored", () => {
    expect(ignoreFiles('console.log("Hello"); /*__@ignore__*/')).toBeTruthy();
    expect(ignoreFiles('console.log("Hello");')).toBeFalsy();
  });
});

describe("noStringifyJsonFiles", () => {
  test("identifies files that should not be stringified", () => {
    expect(
      noStringifyJsonFiles('console.log("Hello"); /*__@noStringify__*/'),
    ).toBeTruthy();
    expect(noStringifyJsonFiles('console.log("Hello");')).toBeFalsy();
  });
});

describe("removeComments", () => {
  test("removes comments from a string", () => {
    expect(
      removeComments(
        '/*__@import:module1__*/console.log("Hello");/*__@ignore__*/',
      ),
    ).toEqual('console.log("Hello");');
  });
});

describe("importModules", () => {
  test("imports module content correctly", () => {
    const fileContent = 'console.log("/*__@import:module1__*/");';
    const result = importModules(fileContent);
    expect(result).toEqual('console.log("module1 content");');
  });

  test("throws an error when a module does not exist", () => {
    const fileContent = 'console.log("/*__@import:nonexistentModule__*/");';
    expect(() => importModules(fileContent)).toThrow();
  });
});

describe("process_file", () => {
  test("processes a file correctly", () => {
    let spy = jest.spyOn(fs, "writeFileSync");
    process_file(path.join(".", "apps", "testAppFolder", "widget", "test.js"), {
      aliases: {
        test: "testAlias",
        nui: "nui.near",
      },
      appAccount: "testAccount",
    });
    expect(spy).toHaveBeenCalledWith(
      path.join(".", "apps", "testAppFolder", "widget", "test.js"),
      'console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
  });

  test("does not modify the file when it should be skipped", () => {
    let spy = jest.spyOn(fs, "writeFileSync");
    process_file(path.join(".", "apps", "testAppFolder", "widget", "skip.js"), {
      aliases: {
        test: "testAlias",
        nui: "nui.near",
      },
      appAccount: "testAccount",
    });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("processCommentCommands", () => {
  test("processes the comment commands correctly", () => {
    const aliases = { test: "testAlias" };
    const appAccount = "testAccount";
    const fileContent =
      'console.log("/*__@replace:test__*/"); console.log("/*__@appAccount__*/");';
    const result = processCommentCommands(fileContent, aliases, appAccount);
    expect(result).toEqual(
      'console.log("testAlias"); console.log("testAccount");',
    );
  });

  test("returns original content when no aliases are found", () => {
    const aliases = { test: "testAlias" };
    const appAccount = "testAccount";
    const fileContent = 'console.log("/*__@replace:nonexistent__*/");';
    const result = processCommentCommands(fileContent, aliases, appAccount);
    expect(result).toEqual('console.log("/*__@replace:nonexistent__*/");');
  });
});
