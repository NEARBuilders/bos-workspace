import express from 'express';
import http from 'http';
import supertest from 'supertest';
import fetchMock from 'jest-fetch-mock';
import { DEFAULT_CONFIG } from '@/lib/config';
import { dev, DevOptions } from '@/lib/dev'; // Update with the correct path to your server file
import { LogLevel, Logger } from "@/lib/logger";

import { vol } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const unmockedLog = global.log;

// Mock fetch
fetchMock.enableMocks();

const app_example_1 = {
  "./bos-loader.json": JSON.stringify({"components":{"test.testnet/widget/home":{"code":"retrun <p>hello world</p>"}},"data":{}}),
};

// Mock express app
const app = express();

// Mock express server
const server = http.createServer(app);

describe('dev', () => {
  let serverInstance: http.Server;

  beforeAll(() => {
    serverInstance = server.listen(3000); // Start the server
  });

  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, '/app_example_1');
    global.log = new Logger(LogLevel.DEV);
  });
  afterAll((done) => {
    serverInstance.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
        done(err);
      } else {
        console.log('Server closed successfully');
        done();
      }
    });
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


    fetchMock.mockOnce(async (req) => {
      if (req.url === 'https://ipfs.near.social/add') {
        return {
          body: JSON.stringify(
            {
              cid: "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
            }
          )
        };
      }
      throw new Error(`Unexpected fetch call: ${req.url}`);
    });

    // Start dev server
    const { server, io } = await dev('/app_example_1', opts);

    // Assert no exceptions
    expect(server).toBeDefined();
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
