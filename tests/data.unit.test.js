const path = require("path");
const { mockFs, restoreFs, DIST_FOLDER } = require("./helpers");
const { generate_data_json } = require("../lib/data");
const fs = require("fs");

beforeEach(() => {
  mockFs();
});
afterEach(() => {
  restoreFs();
});

describe("generateDataJson", () => {
  it("generates data.json file correctly", () => {
    generate_data_json("testAppFolder");

    // verify the data.json
    const dataJson = fs.readFileSync(
      path.join(".", DIST_FOLDER, "testAppFolder", "data.json"),
      "utf8",
    );
    expect(JSON.parse(dataJson)).toMatchObject({
      hello: "Hello, World!",
      test: "{}",
      widget: {
        test: {
          metadata: {
            name: "every video",
            description: "A hub for every video indexed across the BOS.",
            image: {
              ipfs_cid:
                "bafkreihi3qh72njb3ejg7t2mbxuho2vk447kzkvpjtmulsb2njd6m2cfgi",
            },
            tags: {
              app: "",
              video: "",
              livepeer: "",
              everything: "",
            },
          },
        },
      },
    });
  });
});
