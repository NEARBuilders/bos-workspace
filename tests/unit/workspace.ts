/**
 * TODO: Fix the below tests
 */

import path from "path";
import { buildApp } from "@/lib/build";
import { readJson } from "@/lib/utils/fs";
import { devMulti } from "@/lib/dev";
import { buildWorkspace, devWorkspace, readWorkspace } from "@/lib/workspace";

jest.mock("@/lib/build");
jest.mock("@/lib/utils/fs");
jest.mock("@/lib/dev");

describe("buildWorkspace", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should build workspace correctly", async () => {
    const src = "/path/to/src";
    const dest = "/path/to/dest";
    const network = "mainnet";
    const mockApps = ["app1", "app2"];

    readJson.mockResolvedValueOnce({ apps: mockApps });

    await buildWorkspace(src, dest, network);

    expect(readJson).toHaveBeenCalledWith(path.join(src, "bos.workspace.json"));
    expect(buildApp).toHaveBeenCalledTimes(mockApps.length);
    mockApps.forEach((app, index) => {
      expect(buildApp).toHaveBeenNthCalledWith(index + 1, path.join(src, app), path.join(dest, app), network);
    });
  });

  // Add more tests for error cases if needed
});

describe("devWorkspace", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should start workspace correctly", async () => {
    const src = "/path/to/src";
    const mockApps = ["app1", "app2"];
    const devOpts = { /* mock your DevOptions object */ };

    readJson.mockResolvedValueOnce({ apps: mockApps });

    await devWorkspace(src, devOpts);

    expect(readJson).toHaveBeenCalledWith(path.join(src, "bos.workspace.json"));
    expect(devMulti).toHaveBeenCalledWith(src, mockApps.map(app => path.join(src, app)), devOpts);
  });

  // Add more tests for error cases if needed
});

describe("readWorkspace", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should read workspace correctly", async () => {
    const src = "/path/to/src";
    const mockConfig = { apps: ["app1", "app2"] };

    readJson.mockResolvedValueOnce(mockConfig);

    const result = await readWorkspace(src);

    expect(readJson).toHaveBeenCalledWith(src);
    expect(result).toEqual(mockConfig);
  });

  // Add more tests for error cases if needed
});
