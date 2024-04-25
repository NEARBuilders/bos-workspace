import { DevOptions, startServer } from '@/lib/dev';
import { LogLevel, Logger } from "@/lib/logger";
import fetchMock from 'jest-fetch-mock';

import { vol } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const unmockedLog = global.log;

const bos_loader_example = {
  "/bos-loader.json": JSON.stringify({ "components": { "test.testnet/widget/home": { "code": "retrun <p>hello world</p>" } }, "data": {} }),
};

describe('server', () => {

  beforeAll(() => {
    global.fs = vol;
  });

  beforeEach(() => {
    vol.reset();
    vol.fromJSON(bos_loader_example, '/');
    global.log = new Logger(LogLevel.DEV);
  });
  afterAll(() => {
    global.log = unmockedLog;
  });

  it('should start the dev server without errors', async () => {
    const opts: DevOptions = {
      port: 3000,
      NoGateway: false,
      NoHot: false,
      NoOpen: false,
      network: 'testnet',
    };


    // fetchMock.mockOnce(async (req) => {
    //   if (req.url === 'https://ipfs.near.social/add') {
    //     return {
    //       body: JSON.stringify(
    //         {
    //           cid: "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
    //         }
    //       )
    //     };
    //   }
    //   throw new Error(`Unexpected fetch call: ${req.url}`);
    // });

    // Start dev server
    const { serverInstance, io } = await startServer(opts, '/bos-loader.json');

    // Assert no exceptions
    expect(serverInstance).toBeDefined();
    
    serverInstance.close();
  });
});

// describe('RPC Route Tests', () => {
//   let request: supertest.SuperTest<supertest.Test>;

//   beforeAll(() => {
//     request = supertest(server);
//   });

//   afterAll((done) => {
//     server.close(done);
//   });

//   describe('With Default Options', () => {
//     beforeAll(() => {
//       const opts: DevOptions = {
//         port: 3000,
//         NoGateway: false,
//         NoHot: false,
//         NoOpen: false,
//         network: 'test',
//         gateway: 'mocked-gateway-path',
//       };
//       dev(__dirname, opts);
//     });

//     it('should handle RPC requests properly', async () => {
//       const response = await request
//         .post('/rpc')
//         .send({ /* your request body */ });

//       expect(response.status).toBe(200);
//       // Add more assertions as needed
//     });

//     // Add more test cases with default options if needed
//   });

//   describe('With No Gateway Option', () => {
//     beforeAll(() => {
//       const opts: DevOptions = {
//         port: 3001, // Different port to avoid conflicts
//         NoGateway: true, // Set NoGateway to true
//         NoHot: false,
//         NoOpen: false,
//         network: 'test',
//         gateway: 'mocked-gateway-path',
//       };
//       dev(__dirname, opts);
//     });

//     it('should handle RPC requests properly when NoGateway is true', async () => {
//       // Test scenario when NoGateway is true
//     });

//     // Add more test cases with NoGateway option if needed
//   });

//   // Add more describe blocks for testing other combinations of options
// });
