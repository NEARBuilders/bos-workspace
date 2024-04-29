import { buildApp } from "@/lib/build";
import { DEFAULT_CONFIG, loadConfig } from "@/lib/config";
import { dev, DevOptions } from "@/lib/dev";
import { Logger, LogLevel } from "@/lib/logger";
import { startDevServer } from "@/lib/server";
import { startSocket } from "@/lib/socket";
import { startFileWatcher } from "@/lib/watcher";
import http from "http";
import { Server as IoServer } from "socket.io";

import { vol } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const unmockedLog = global.log;

const app_example_1 = {
  "./build/bos-loader.json": JSON.stringify({ "components": { "test.testnet/widget/home": { "code": "return <p>hello world</p>" } }, "data": {} }),
};

jest.mock("@/lib/config");
jest.mock("@/lib/server");
jest.mock("@/lib/socket");
jest.mock("@/lib/watcher");
jest.mock("@/lib/build")

describe("dev", () => {
  const mockSrc = "/app_example_1";
  const mockOpts: DevOptions = {};
  const mockConfig = DEFAULT_CONFIG;

  beforeEach(() => {
    vol.reset();
    vol.fromJSON(app_example_1, mockSrc);
    global.log = new Logger(LogLevel.DEV);

    (loadConfig as jest.MockedFunction<typeof loadConfig>).mockResolvedValue(mockConfig);
    (startDevServer as jest.MockedFunction<typeof startDevServer>).mockReturnValue({} as http.Server);
    (startSocket as jest.MockedFunction<typeof startSocket>).mockReturnValue({} as IoServer);
    (buildApp as jest.MockedFunction<typeof buildApp>).mockReturnValue({} as Promise<any>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.log = unmockedLog;
  });

  it("should call loadConfig with src and opts.network", async () => {
    await dev(mockSrc, mockOpts);
    expect(loadConfig).toHaveBeenCalledWith(mockSrc, mockOpts.network);
  });

  it("should call generateApp with src, dist, config, opts, and devJsonPath", async () => {
    await dev(mockSrc, mockOpts);
    const mockDevJsonPath = `${mockSrc}/build/bos-loader.json`;
    expect(startDevServer).toHaveBeenCalledWith(mockDevJsonPath, mockOpts);
  });

  it("should start the socket server if hot reload is enabled", async () => {
    const mockHotOpts: DevOptions = { NoHot: false };
    await dev(mockSrc, mockHotOpts);
    expect(startSocket).toHaveBeenCalled();
  });

  it("should not start the socket server if hot reload is disabled", async () => {
    const mockNoHotOpts: DevOptions = { NoHot: true };
    await dev(mockSrc, mockNoHotOpts);
    expect(startSocket).not.toHaveBeenCalled();
  });

  it("should call startFileWatcher with correct watch paths", async () => {
    await dev(mockSrc, mockOpts);
    const expectedWatchPaths = [
      `${mockSrc}/widget/**/*`,
      `${mockSrc}/module/**/*`,
      `${mockSrc}/ipfs/**/*`,
      `${mockSrc}/bos.config.json`,
      `${mockSrc}/aliases.json`,
    ];
    expect(startFileWatcher).toHaveBeenCalledWith(expectedWatchPaths, expect.any(Function));
  });
});