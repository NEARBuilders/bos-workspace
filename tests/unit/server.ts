import { buildGatewayObject, DEFAULT_GATEWAY, DevOptions } from '@/lib/dev';
import { Logger, LogLevel } from "@/lib/logger";
import { createApp, RPC_URL } from '@/lib/server';
import supertest from 'supertest';
import { TextEncoder } from 'util';
import { Network } from '@/lib/types';
import { fetchJson } from "@near-js/providers";
import * as gateway from '@/lib/gateway';

import { vol } from 'memfs';
import path from 'path';

jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);
jest.mock("@near-js/providers");
jest.mock('@/lib/gateway');

Object.assign(global, { TextEncoder });

const unmockedLog = global.log;
const unmockedFetch = global.fetch;

const devJson = { "components": { "test.testnet/widget/home": { "code": "return <p>hello world</p>" } }, "data": {} };
const app_example_1 = {
  "./build/bos-loader.json": JSON.stringify(devJson),
};

describe('createApp', () => {
  let app;
  const mockSrc = "/app_example_1";
  const devJsonPath = `${mockSrc}/build/bos-loader.json`;
  const opts: DevOptions = {
    gateway: true,
    port: 3000,
    hot: true,
    network: 'testnet' as Network,
  };

  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, mockSrc);
    global.log = new Logger(LogLevel.DEV);

    vol.reset();
    vol.fromJSON(app_example_1, mockSrc);

    global.log = new Logger(LogLevel.DEV);

    app = createApp(devJsonPath, opts);

    app = createApp(devJsonPath, opts);
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.log = unmockedLog;
    global.fetch = unmockedFetch;
  });

  it.skip('should set up the app correctly when opts.gateway is a valid local path', () => {
		const gatewayObject = DEFAULT_GATEWAY
		gatewayObject.bundleUrl = '/mock_gateway_1/dist'
		
    vol.mkdirSync(path.join(gatewayObject.bundleUrl, 'dist'), { recursive: true });
    vol.writeFileSync(path.join(gatewayObject.bundleUrl, 'dist', 'index.html'), '<html></html>');
    
    jest.spyOn(gateway, 'modifyIndexHtml').mockReturnValue('<html>modified</html>');
    
    app = createApp(devJsonPath, opts, gatewayObject);
    expect(app).toBeDefined();
    
    return supertest(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect('<html>modified</html>');
  });

  it.skip('should log an error when opts.gateway is an invalid local path', () => {
		const gatewayObject = DEFAULT_GATEWAY
		gatewayObject.bundleUrl = '/invalid/gateway/path';

		buildGatewayObject(true, gatewayObject)
    
    const logSpy = jest.spyOn(global.log, 'error');
    
    app = createApp(devJsonPath, opts, gatewayObject);
    expect(app).toBeDefined();
    expect(logSpy).toHaveBeenCalledWith("Gateway not found. Skipping...");
  });

  it('/api/loader should return devJson', async () => {
    const response = await supertest(app).get('/api/loader');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(devJson);
  });

  it("/api/proxy-rpc should proxy rpc request if key exists", async () => {
    const request = { "method": "query", "params": { "request_type": "call_function", "account_id": "v1.social08.testnet", "method_name": "get", "args_base64": "eyJrZXlzIjpbInRlc3QudGVzdG5ldC93aWRnZXQvaG9tZSJdfQ==", "finality": "optimistic" }, "id": 123, "jsonrpc": "2.0" };

    (fetchJson as jest.MockedFunction<typeof fetchJson>).mockImplementation((url, req) => {
      expect(url).toBe(RPC_URL[opts.network]);
      expect(req).toEqual(JSON.stringify(request));
      return Promise.resolve({
        result: {
          result: [] // initialize an empty result
        }
      });
    });

    const response = await supertest(app).post('/api/proxy-rpc').send(request);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toHaveProperty('result');
    expect(Array.isArray(response.body.result.result)).toBe(true);
    expect(response.body.result.result.length).toBeGreaterThan(0); // confirm it is replaced by dev json
  });

  it("/api/proxy-rpc should not proxy rpc request (return original) if key does not exist", async () => {
    const request = { "method": "query", "params": { "request_type": "call_function", "account_id": "v1.social08.testnet", "method_name": "get", "args_base64": "eyJrZXlzIjpbIm1pa2UudGVzdG5ldC93aWRnZXQvUHJvZmlsZUltYWdlIl19", "finality": "optimistic" }, "id": 123, "jsonrpc": "2.0" };
    (fetchJson as jest.MockedFunction<typeof fetchJson>).mockImplementation((url, req) => {
      expect(url).toBe(RPC_URL[opts.network]);
      expect(req).toEqual(JSON.stringify(request));
      return Promise.resolve({
        result: {
          result: [] // initialize an empty result
        }
      });
    });

    const response = await supertest(app).post('/api/proxy-rpc').send(request);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toHaveProperty('result');
    expect(Array.isArray(response.body.result.result)).toBe(true);
    expect(response.body.result.result.length).toEqual(0); // confirm it is NOT replaced by dev json
  });
});