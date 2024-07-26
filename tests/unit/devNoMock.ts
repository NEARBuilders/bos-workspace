import { startFileWatcher } from "@/lib/watcher";
import path from "path";
import fs from "fs";

describe("File Watcher Tests", () => {
	let watcher;
	const tempDirPath = path.join(__dirname, "temp-test");

  it("should call the file watcher callback with the correct attributes", async () => {
    const mockCallback = jest.fn();

    fs.mkdirSync(tempDirPath, { recursive: true });

    const tempFilePath = path.join(tempDirPath, "temp-file.txt");

		const relativeTempFilePath = path.relative("./", tempFilePath)

    fs.writeFileSync(tempFilePath, "initial content");

    watcher = startFileWatcher([relativeTempFilePath], mockCallback);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    fs.appendFileSync(tempFilePath, "\nadded content");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(mockCallback).toHaveBeenCalled();
    expect(mockCallback.mock.calls[0][0]).toBe("change");
    expect(mockCallback.mock.calls[0][1]).toBe(path.resolve(tempFilePath));
  });

	afterAll(async () => {
		if (watcher) await watcher.close();

    if (fs.existsSync(tempDirPath)) {
      fs.rmSync(tempDirPath, { recursive: true, force: true });
    }
  });
});