import { buildApp } from '@/lib/build';
import { BaseConfig, DEFAULT_CONFIG } from '@/lib/config';
import * as fs from '@/lib/utils/fs';

import { vol, } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const app_example_1 = {
  "./bos.config.json": JSON.stringify({
    ...DEFAULT_CONFIG,
    accounts: {
      deploy: "test.near",
    },
    ipfs: {
      gateway: "https://testipfs/ipfs",
    },
    format: true,
  }),
  "./aliases.json": JSON.stringify({
    "name": "world",
  }),
  "./ipfs/logo.svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='red' /></svg>",
  "./module/hello/utils.ts": "const hello = (name: string) => `Hello, ${name}!`; export { hello };",
  "./widget/index.tsx": "type Hello = {}; return Hello;",
  "./widget/index.metadata.json": JSON.stringify({
    name: "Hello",
    description: "Hello world widget",
  }),
  "./widget/module.tsx": "VM.require('@{module/hello/utils.ts}'); return hello('world');",
  "./widget/config.jsx": "return <h1>@{config/account}@{config/account.deploy}</h1>;",
  "./widget/alias.tsx": "return <h1>Hello @{alias/name}!</h1>;",
  "./widget/ipfs.tsx": "return <img height='100' src='@{ipfs/logo.svg}' />;",
  "./data/thing/data.json": JSON.stringify({
    "type": "efiz.near/type/thing",
  })
};

const app_example_1_output = {
  "/build/ipfs.json": JSON.stringify({
    "logo.svg": "QmHash",
  }),
  "/app_example_1/ipfs.json": JSON.stringify({
    "logo.svg": "QmHash",
  }),
  "/build/widget/hello.utils.module.js": "const hello = (name) => `Hello, ${name}!`; export { hello };",
  "/build/widget/index.jsx": "return Hello;",
  "/build/widget/module.jsx": "VM.require('test.near/widget/hello.utils.module}'); return hello('world');",
  "/build/widget/config.jsx": "return <h1>test.neartest.near</h1>;",
  "/build/widget/alias.jsx": "return <h1>Hello world!</h1>;",
  "/build/widget/ipfs.tsx": "return <img height='100' src='https://testipfs/ipfs/QmHash' />;",
  "/build/data.json": JSON.stringify({
    "test.near": {
      thing: {
        data: JSON.stringify({
          "type": "efiz.near/type/thing",
        })
      },
      widget: {
        index: {
          metadata: {
            name: "Hello",
            description: "Hello world widget",
          }
        }
      }
    }
  })
};

describe('build', () => {
  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
  })

  it('should build correctly', async () => {
    await buildApp('/app_example_1', '/build');
    expect(vol.toJSON('/build')).toEqual(app_example_1_output);
  })
})
