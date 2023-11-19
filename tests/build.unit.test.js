const path = require("path");
const { mockFs, restoreFs, DIST_FOLDER } = require("./helpers");
const fs = require("fs");
const { create_dist } = require("../lib/utils");
const { process_dist, build } = require("../lib/build");
const { glob } = require("glob");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

describe("process_dist", () => {
  test("processes an app folder correctly", async () => {
    const spy = jest.spyOn(fs, "writeFileSync");
    create_dist("testAppFolder", DIST_FOLDER);
    process_dist("testAppFolder", DIST_FOLDER);
    expect(spy).toHaveBeenCalledWith(
      path.join(".", DIST_FOLDER, "testAppFolder", "src", "test.js"),
      'console.log("testAlias");<Widget src="nui.near/widget/index" />',
    );
  });
});

describe("build", () => {
  test("executes the build script correctly", async () => {
    await build();

    const files = glob.sync(`${DIST_FOLDER}/**/*`, { nodir: true });

    expect(files).toMatchObject([
      path.join(DIST_FOLDER, "testAppFolder", "data.json"),
      path.join(DIST_FOLDER, "testAppFolder", "src", "test.js"),
      path.join(DIST_FOLDER, "testAppFolder", "src", "skip.js"),
    ]);
  });
});
