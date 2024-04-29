import { copy, readFile, lstat, readJson, writeJson, ensureDir, outputFile, readdir, remove, move, pathExists } from 'fs-extra';
import path from 'path';

async function loopThroughFiles(pwd: string, callback: (file: string) => Promise<void>) {
  const files = await readdir(pwd, {
    encoding: 'utf-8',
    withFileTypes: true,
  }).catch(() => ([]));
  for (const file of files) {
    const filePath = path.join(pwd, file.name);
    if (file.isDirectory()) {
      await loopThroughFiles(filePath, callback);
    } else {
      await callback(filePath);
    }
  }
}

export { copy, readJson, writeJson, ensureDir, outputFile, loopThroughFiles, readFile, readdir, remove, move, pathExists };
