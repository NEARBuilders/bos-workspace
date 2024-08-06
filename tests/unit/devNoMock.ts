import { startFileWatcher } from "@/lib/watcher";
import path from "path";
import fs from "fs";
import { processDirectory } from "@/lib/utils/fs";

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

describe('Folder structure processing', () => {
  const tempDirPath = path.join(__dirname, 'temp_test_dir');
  const testFolderPath = path.join(tempDirPath, 'test');
  const nestedTestFolderPath = path.join(testFolderPath, 'nestedTest');
  const test1FolderPath = path.join(tempDirPath, 'test1');

  beforeAll(() => {
    fs.mkdirSync(tempDirPath, { recursive: true });
    fs.mkdirSync(testFolderPath, { recursive: true });
    fs.mkdirSync(nestedTestFolderPath, { recursive: true });
    fs.mkdirSync(test1FolderPath, { recursive: true });

    fs.writeFileSync(
      path.join(testFolderPath, 'file.json'),
      JSON.stringify({ data: "this is test" })
    );
    fs.writeFileSync(
      path.join(nestedTestFolderPath, 'nestedFile.json'),
      JSON.stringify({ data: "this is a nested folder", data2: "other data" })
    );
    fs.writeFileSync(
      path.join(test1FolderPath, 'file1.json'),
      JSON.stringify({ data: "this is test1" })
    );
  });

  it("should build the correct object based on folder structure", async () => {
    const config = {
      data: {
        include: [tempDirPath]
      },
      account: 'myaccount'
    };
  
    const result = {};

    for (const folder of config.data.include) {
      const folderName = path.basename(folder);
      result[folderName] = {};
      await processDirectory(folder, '', result[folderName]);
    }
  
    expect(result).toEqual({
      'temp_test_dir': {
        'test.nestedTest.nestedFile': {
          '': JSON.stringify({ data: "this is a nested folder", data2: "other data" })
        },
        'test.file': {
          '': JSON.stringify({ data: "this is test" })
        },
        'test1.file1': {
          '': JSON.stringify({ data: "this is test1" })
        }
      }
    });
  });

  afterAll(() => {
    fs.rmSync(tempDirPath, { recursive: true, force: true });
  });
});
