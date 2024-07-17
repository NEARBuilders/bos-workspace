import { copy, ensureDir, move, outputFile, pathExists, readdir, readFile, readJson, remove, writeJson } from 'fs-extra';
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

export { copy, ensureDir, loopThroughFiles, move, outputFile, pathExists, readdir, readFile, readJson, remove, writeJson };

