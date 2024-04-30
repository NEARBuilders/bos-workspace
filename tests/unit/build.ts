import { buildApp } from '@/lib/build';
import { DEFAULT_CONFIG } from '@/lib/config';
import { LogLevel, Logger } from "@/lib/logger";

import { vol, } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const app_example_1 = {
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
  "./widget/deeply/nested/index.tsx": "type Hello = {}; const hello: Hello = 'hi'; export default hello;",
  "./widget/deeply/nested/index.metadata.json": JSON.stringify({
    name: "Deeply nested Hello",
    description: "Deeply nested Hello world widget",
  }),
  "./widget/very/deeply/nested/index.tsx": "type Hello = {}; const hello: Hello = 'hi'; export default hello;",
  "./widget/very/deeply/nested/index.metadata.json": JSON.stringify({
    name: "Very deeply nested Hello",
    description: "Very deeply nested Hello world widget",
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

const app_example_1_output = {
  "/build/ipfs.json": JSON.stringify({
    "logo.svg": "QmHash",
  }, null, 2) + "\n",
  "/build/src/widget/hello.utils.module.js": "const hello = (name) => `Hello, ${name}!`;\nreturn { hello };\n",
  "/build/src/widget/index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/widget/nested.index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/widget/deeply.nested.index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/widget/very.deeply.nested.index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/widget/module.jsx": "VM.require(\"test.near/widget/hello.utils.module\");\nreturn hello(\"world\");\n",
  "/build/src/widget/config.jsx": "return <h1>test.neartest.near</h1>;\n",
  "/build/src/widget/alias.jsx": "return <h1>Hello world!</h1>;\n",
  "/build/src/widget/ipfs.jsx": "return <img height=\"100\" src=\"https://testipfs/ipfs/QmHash\" />;\n",
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
        "deeply.nested.index": {
          metadata: {
            name: "Deeply nested Hello",
            description: "Deeply nested Hello world widget",
          }
        },
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
        },
        "very.deeply.nested.index": {
          metadata: {
            name: "Very deeply nested Hello",
            description: "Very deeply nested Hello world widget",
          }
        }
      }
    }
  }, null, 2) + "\n",
};

const app_example_2 = {
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

const app_example_2_output = {
  "/build/ipfs.json": JSON.stringify({
    "logo.svg": "QmHash",
  }, null, 2) + "\n",
  "/build/src/widget/hello.utils.module.js": "const hello = (name) => `Hello, ${name}!`;\nreturn { hello };\n",
  "/build/src/widget/index.jsx": "const hello = \"hi\";\nreturn hello(props);\n",
  "/build/src/widget/module.jsx": "VM.require(\"test.near/widget/hello.utils.module\");\nreturn hello(\"world\");\n",
  "/build/src/widget/config.jsx": "return <h1>test.neartest.near</h1>;\n",
  "/build/src/widget/alias.jsx": "return <h1>Hello world!</h1>;\n",
  "/build/src/widget/ipfs.jsx": "return <img height=\"100\" src=\"https://testipfs/ipfs/QmHash\" />;\n",
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
      }
    }
  }, null, 2) + "\n",
};

const unmockedFetch = global.fetch;
const unmockedLog = global.log;

describe('build', () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');

    global.fetch = (() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          cid: "QmHash",
        })
      })
    }) as any;
    global.log = new Logger(LogLevel.DEV);
  })
  afterAll(() => {
    global.fetch = unmockedFetch;
    global.log = unmockedLog;
  })

  it('should build correctly', async () => {
    await buildApp('/app_example_1', '/build');
    expect(vol.toJSON('/build')).toEqual(app_example_1_output);
  })

  it('should build correctly without unnecessary files', async () => {
    await buildApp('/app_example_1', '/build');
    expect(vol.toJSON('/build')).toEqual(app_example_1_output);

    vol.fromJSON(app_example_2, '/app_example_2');
    await buildApp('/app_example_2', '/build');
    expect(vol.toJSON('/build')).toEqual(app_example_2_output);
  })
})
