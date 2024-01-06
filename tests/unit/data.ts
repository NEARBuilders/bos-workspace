import { readJson } from '@/lib/utils/fs';
import { generateData } from '@/lib/data';

import { vol, } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const app_example_1 = {
  "./module/because.metadata.json": JSON.stringify({
    name: "Hello",
  }),
  "./widget/hello/index.metadata.json": JSON.stringify({
    name: "Hello",
  }),
  "./data/thing/deep/data.json": JSON.stringify({
    "type": "efiz.near/type/thing",
  }),
  "./data/index.json": JSON.stringify({
    "some": {
      "data": {
        "inside": "here"
      }
    }
  }),
  "./data/stringified.jsonc": JSON.stringify({
    "should": "be saved as string json",
  }),
  "./data/text.txt": "hello world",
};

const expectedData = {
  "hello.near": {
    widget: {
      because: {
        metadata: {
          name: "Hello",
        }
      },
      "hello.index": {
        metadata: {
          name: "Hello",
        }
      }
    },
    stringified: "{\"should\":\"be saved as string json\"}",
    text: "hello world",
    thing: {
      deep: {
        data: {
          type: "efiz.near/type/thing"
        }
      },
    },
    index: {
      some: {
        data: {
          inside: "here"
        }
      }
    }
  }
};

describe("generateData", () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
  })

  it("generates data.json properly", async () => {
    await generateData("/app_example_1", "/build", "hello.near");
    expect(await readJson("/app_example_1/data.json")).toEqual(expectedData);
  })
})

