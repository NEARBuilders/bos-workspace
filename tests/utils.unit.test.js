const path = require("path");
const { for_folder, for_rfile, create_dist } = require("../lib/utils");
const { mockFs, restoreFs, DIST_FOLDER } = require("./helpers");
const glob = require("glob");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

describe("for_folder function", () => {
  test("should call the callback function for each folder", () => {
    const fn = jest.fn();
    for_folder(".", fn);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenCalledWith(path.join(".", DIST_FOLDER));
    expect(fn).toHaveBeenCalledWith(path.join(".", "apps"));
    expect(fn).toHaveBeenCalledWith(path.join(".", "modules"));
  });
});

describe("for_rfile function", () => {
  test("should call the callback function for each file in the tree", () => {
    const fn = jest.fn();
    const fld = path.join(".", "apps", "testAppFolder");
    for_rfile(fld, ["js", "jsonc"], fn);
    expect(fn).toHaveBeenCalledTimes(4);
    expect(fn).toHaveBeenCalledWith(path.join(fld, "test.jsonc"));
    expect(fn).toHaveBeenCalledWith(path.join(fld, "ignore.jsonc"));
    expect(fn).toHaveBeenCalledWith(path.join(fld, "widget", "skip.js"));
    expect(fn).toHaveBeenCalledWith(path.join(fld, "widget", "test.js"));
  });
});

describe("create_dist function", () => {
  test("should copy all the js files to dist folder", () => {
    create_dist("testAppFolder", DIST_FOLDER);
    const files = glob.sync(`${DIST_FOLDER}/**/*.js`);
    expect(files).toEqual([
      path.join(DIST_FOLDER, "testAppFolder", "src", "test.js"),
      path.join(DIST_FOLDER, "testAppFolder", "src", "skip.js"),
    ]);
  });
});
