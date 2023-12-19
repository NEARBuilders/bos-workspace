import { readJson } from '@/lib/utils/fs';
import { generateData, getData, getMetadata } from '@/lib/data';

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

const expectedDataFolder = {
  data: {
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
const expectedDataJson = {
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
  }
};

describe("generateData", () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
  })

  it("generates data.json properly", async () => {
    // const data = await generateData("/app_example_1");
    // expect(readJson(data)).toEqual(Object.assign({}, expectedDataJson, expectedDataFolder));
  })
})

describe("getMetadata", () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
  })
  it("it returns the metadata from /module/ and /widget/", async () => {
    const metadataModules: any = await getMetadata("/app_example_1/module");
    const metadataWidgets: any = await getMetadata("/app_example_1/widget");
    const output = {
      widget: {
        ...metadataModules.widget,
        ...metadataWidgets.widget,
      }
    }
    expect(output).toEqual(expectedDataJson);
  })
})

describe("getData", () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
  })
  it("it returns the data from /data/", async () => {
    const data = await getData("/data");
    expect(data).toEqual(expectedDataFolder);
  })
})
