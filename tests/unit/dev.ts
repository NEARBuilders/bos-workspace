import { buildApp } from "@/lib/build";
import { DEFAULT_CONFIG, loadConfig } from "@/lib/config";
import { dev, DevOptions, addApps } from "@/lib/dev";
import { Logger, LogLevel } from "@/lib/logger";
import { startDevServer } from "@/lib/server";
import { startSocket } from "@/lib/socket";
import { startFileWatcher } from "@/lib/watcher";
import http from "http";
import path from "path";
import { Server as IoServer } from "socket.io";
import { Gaze } from "gaze";

import { vol } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const unmockedLog = global.log;

const app_example_1 = {
  "./build/bos-loader.json": JSON.stringify({ "components": { "test.testnet/widget/home": { "code": "return <p>hello world</p>" } }, "data": {} }),
};

const app_example_2 = {
  "./build/bos-loader.json": JSON.stringify({ "components": { "test.testnet/widget/home": { "code": "return <p>goodbye nothing</p>" } }, "data": {} }),
};

jest.mock("@/lib/config");
jest.mock("@/lib/server");
jest.mock("@/lib/socket");
jest.mock("@/lib/watcher");
jest.mock("@/lib/build");

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
    (startSocket as jest.MockedFunction<typeof startSocket>).mockReturnValue(new IoServer());
    (startFileWatcher as jest.MockedFunction<typeof startFileWatcher>).mockReturnValue(new Gaze(mockSrc));
    (buildApp as jest.MockedFunction<typeof buildApp>).mockReturnValue({} as Promise<any>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.log = unmockedLog;
  });

  it("should call loadConfig with src and opts.network", async () => {
    await dev(mockSrc, "build", mockOpts);
    expect(loadConfig).toHaveBeenCalledWith(mockSrc, mockOpts.network);
  });

  it("should call generateApp with src, dist, config, opts, and devJsonPath", async () => {
    await dev(mockSrc, "build", mockOpts);
    const mockDist = path.join(mockSrc, 'build');
    const mockDevJsonPath = path.join(mockSrc, 'build', 'bos-loader.json');
    expect(startDevServer).toHaveBeenCalledWith([mockSrc], [mockDist], mockDevJsonPath, mockOpts);
  });

  it("should start the socket server if hot reload is enabled", async () => {
    const mockOpts: DevOptions = { hot: true };
    await dev(mockSrc, "build", mockOpts);
    expect(startSocket).toHaveBeenCalled();
  });

  it("should not start the socket server if hot reload is disabled", async () => {
    const mockOpts: DevOptions = { hot: false };
    await dev(mockSrc, "build", mockOpts);
    expect(startSocket).not.toHaveBeenCalled();
  });

  it("should call startFileWatcher with correct watch paths", async () => {
    await dev(mockSrc, "build", mockOpts);
    const expectedWatchPaths = [
      path.join(mockSrc, 'widget', '**', '*'),
      path.join(mockSrc, 'module', '**', '*'),
      path.join(mockSrc, 'ipfs', '**', '*'),
      path.join(mockSrc, 'bos.config.json'),
      path.join(mockSrc, 'aliases.json'),
    ];
    expect(startFileWatcher).toHaveBeenCalledWith(expectedWatchPaths, expect.any(Function));
  });

  it("should add correct watch paths after adding apps", async () => {
    const mockedGazeAdd = jest.spyOn(Gaze.prototype, 'add');
    
    const mockOpts: DevOptions = { hot: false };
    await dev(mockSrc, "build", mockOpts);

    const mockSrc2 = "/app_example_2";
    vol.fromJSON(app_example_2, mockSrc2);
    const mockDist2 = path.join(mockSrc2, 'build');
    await addApps([mockSrc2], [mockDist2]);

    const expectedWatchPaths = [
      path.join(mockSrc2, 'widget', '**', '*'),
      path.join(mockSrc2, 'module', '**', '*'),
      path.join(mockSrc2, 'ipfs', '**', '*'),
      path.join(mockSrc2, 'bos.config.json'),
      path.join(mockSrc2, 'aliases.json'),
    ];
    expect(mockedGazeAdd).toHaveBeenCalledWith(expectedWatchPaths);
  });
});