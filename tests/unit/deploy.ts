import * as process from "child_process";
import { deployAppCode } from '@/lib/deploy';
import { BaseConfig, DEFAULT_CONFIG } from '@/lib/config';
import * as fs from '@/lib/utils/fs';
import { LogLevel, Logger } from "@/lib/logger";
import EventEmitter from "events";

import { vol, } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

jest.mock('child_process', () => ({
  spawn: jest.fn((command, args, options) => {
    // Create a mock for the ChildProcess object
    const mockChildProcess = new EventEmitter();

    // Simulate the 'on' method for event handling
    mockChildProcess.on = jest.fn((event, callback) => {
      if (event === 'close') {
        callback(0);
      }
      if (event === 'error') {
        callback(new Error('error'));
      }
      return mockChildProcess;
    });
    return mockChildProcess;
  }),
}));

const app_example = {
  "./bos.config.json": JSON.stringify({
    ...DEFAULT_CONFIG,
    account: "test.near",
    ipfs: {
      gateway: "https://testipfs/ipfs",
    },
    format: true,
  }),
  "./aliases.json": JSON.stringify({
    "name": "world",
  }),
  "./ipfs/logo.svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='red' /></svg>",
  "./module/hello/utils.ts": "const hello = (name: string) => `Hello, ${name}!`; export default { hello };",
  "./widget/index.tsx": "type Hello = {}; const hello: Hello = 'hi'; export default hello;",
  "./widget/index.metadata.json": JSON.stringify({
    name: "Hello",
    description: "Hello world widget",
  }),
  "./widget/nested/index.tsx": "type Hello = {}; const hello: Hello = 'hi'; export default hello;",
  "./widget/nested/index.metadata.json": JSON.stringify({
    name: "Nested Hello",
    description: "Nested Hello world widget",
  }),
  "./widget/module.tsx": "VM.require('${module_hello_utils}'); export default hello('world');",
  "./widget/config.jsx": "return <h1>${config_account}${config_account_deploy}</h1>;",
  "./widget/alias.tsx": "export default <h1>Hello ${alias_name}!</h1>;",
  "./widget/ipfs.tsx": "export default <img height='100' src='${ipfs_logo.svg}' />;",
  "./data/thing/data.json": JSON.stringify({
    "type": "efiz.near/type/thing",
  }),
  "./data/thing/datastring.jsonc": JSON.stringify({
    name: "Thing",
  }),
};

const app_example_output = {
  "/build/ipfs.json": JSON.stringify({
    "logo.svg": "QmHash",
  }, null, 2) + "\n",
  "/build/src/hello.utils.module.js": "const hello = (name) => `Hello, ${name}!`;\nreturn { hello };\n",
  "/build/src/index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/nested.index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/module.jsx": "VM.require(\"test.near/widget/hello.utils.module\");\nreturn hello(\"world\");\n",
  "/build/src/config.jsx": "return <h1>test.neartest.near</h1>;\n",
  "/build/src/alias.jsx": "return <h1>Hello world!</h1>;\n",
  "/build/src/ipfs.jsx": "return <img height=\"100\" src=\"https://testipfs/ipfs/QmHash\" />;\n",
  "/build/data.json": JSON.stringify({
    "test.near": {
      thing: {
        data: {
          "type": "efiz.near/type/thing",
        },
        datastring: JSON.stringify({
          name: "Thing",
        })
      },
      widget: {
        index: {
          metadata: {
            name: "Hello",
            description: "Hello world widget",
          }
        },
        "nested.index": {
          metadata: {
            name: "Nested Hello",
            description: "Nested Hello world widget",
          }

        }
      }
    }
  }, null, 2) + "\n",
};

const unmockedFetch = global.fetch;
const unmockedLog = global.log;

describe('deploy', () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example, '/app_example');

    global.fetch = (() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          cid: "QmHash",
        })
      })
    }) as any;
    global.log = new Logger(LogLevel.ERROR);
  })
  afterAll(() => {
    global.fetch = unmockedFetch;
    global.log = unmockedLog;
  })

  it('should match expected input for bos-cli-rs', async () => {
    await deployAppCode('/app_example', '/build', {});
    expect(vol.toJSON('/build')).toEqual(app_example_output);
  })
})
