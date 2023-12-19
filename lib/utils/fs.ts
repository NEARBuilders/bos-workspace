import { copy, readFile, lstat, readJson, writeJson, ensureDir, outputFile, readdir } from 'fs-extra';
import path from 'path';

async function loopThroughFiles(pwd: string, callback: (file: string) => Promise<void>) {
  const files = await readdir(pwd).catch(() => ([]));
  for (const file of files) {
    const filePath = path.join(pwd, file);
    const stat = await lstat(filePath);
    if (stat.isDirectory()) {
      await loopThroughFiles(filePath, callback);
    } else {
      await callback(filePath);
    }
  }
}

export { copy, readJson, writeJson, ensureDir, outputFile, loopThroughFiles, readFile };
