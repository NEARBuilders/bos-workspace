import { DevOptions } from '@/lib/dev';
import { handleReplacements } from '@/lib/gateway';
import { Logger, LogLevel } from "@/lib/logger";
import { Network } from '@/lib/types';

const unmockedLog = global.log;

describe("gateway", () => {

  beforeEach(() => {
    global.log = new Logger(LogLevel.DEV);
  });

  afterEach(() => {
    global.log = unmockedLog;
  });

  // Mocked input options
  const mockOpts: DevOptions = {
    port: 8080,
    hot: true,
    network: 'testnet' as Network,
    index: "test/widget/index"
  };

  // Test replacement of environment configuration
  it("should replace the ENV_CONFIG placeholder with correct JSON configuration", () => {
    const htmlInput = "<html><head>%ENV_CONFIG%</head><body></body></html>";
    const expectedConfig = JSON.stringify({
      bosLoaderWs: `ws://127.0.0.1:8080`,
      bosLoaderUrl: `http://127.0.0.1:8080/api/loader`,
      enableHotReload: mockOpts.hot,
      network: mockOpts.network,
    });
    const expectedHtmlOutput = `<html><head>${expectedConfig}</head><body></body></html>`;

    const result = handleReplacements(htmlInput, mockOpts);
    expect(result).toBe(expectedHtmlOutput);
  });

  // Test replacement of the near-social-viewer component with an RPC attribute
  it("should replace <near-social-viewer></near-social-viewer> with near-social-viewer having an RPC attribute", () => {
    const htmlInput = "<html><head></head><body><near-social-viewer></near-social-viewer></body></html>";
    const expectedHtmlOutput = `<html><head></head><body><near-social-viewer src="${mockOpts.index}" rpc="http://127.0.0.1:${mockOpts.port}/api/proxy-rpc" network="${mockOpts.network}" ></near-social-viewer></body></html>`;

    const result = handleReplacements(htmlInput, mockOpts);
    expect(result).toBe(expectedHtmlOutput);
  });
});