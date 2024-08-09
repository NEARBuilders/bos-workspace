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

async function processDirectory(baseDir, currentDir, result) {
  const files = await readdirSync(path.join(baseDir, currentDir), { withFileTypes: true });
  for (const file of files) {
    const relativePath = path.join(currentDir, file.name);
    const fullPath = path.join(baseDir, relativePath);
    
    if (file.isDirectory()) {
      await processDirectory(baseDir, relativePath, result);
    } else if (path.extname(file.name).toLowerCase() === '.json') {
      try {
        const fileContent = await readFileSync(fullPath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        let key;
        if (currentDir === '') {
          key = path.basename(file.name, '.json');
        } else {
          key = path.join(currentDir, path.basename(file.name, '.json')).replace(/[\\/]/g, '.');
        }
        result[key] = { "": JSON.stringify(jsonContent) };
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  }
}

export { copy, ensureDir, loopThroughFiles, move, outputFile, pathExists, readdir, readFile, readJson, remove, writeJson, existsSync, promises, processDirectory };
