import { copy, ensureDir, move, outputFile, pathExists, readdir, readFile, readJson, remove, writeJson, existsSync, promises } from 'fs-extra';
import { readdirSync, readFileSync } from 'fs';
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

async function processDirectory(dir, result) {
  const files = await readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await processDirectory(filePath, result);
    } else if (path.extname(file.name).toLowerCase() === '.json') {
      try {
        const fileContent = await readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        const relativePath = path.relative(process.cwd(), filePath);
        const key = path.dirname(relativePath) + '/' + path.basename(file.name, '.json');
        result[key] = jsonContent;
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  }
}

export { copy, ensureDir, loopThroughFiles, move, outputFile, pathExists, readdir, readFile, readJson, remove, writeJson, existsSync, promises, processDirectory };
