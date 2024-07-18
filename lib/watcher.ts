import chokidar from 'chokidar';
import path from 'path';

let watcher: chokidar.FSWatcher | null = null;

export function startFileWatcher(root: string, watchPaths: string[], callback: Function): void {
  const normalizedPaths = watchPaths.map(p => path.normalize(p));

  if (!watcher) {
    watcher = chokidar.watch(normalizedPaths, {
      ignoreInitial: true,
      awaitWriteFinish: true,
      cwd: root
    });

    watcher.on('all', (event, filePath) => {
      const absolutePath = path.resolve(root, filePath);
      console.log(`File ${event}: ${absolutePath}`);
      callback(event, absolutePath);
    });
  } else {
    watcher.add(normalizedPaths);
  }
}

export function addWatchPaths(newPaths: string[]): void {
  const normalizedPaths = newPaths.map(p => path.normalize(p));

  if (watcher) {
    watcher.add(normalizedPaths);
  }
}

export function getWatchPaths(src: string): string[] {
  return [
    path.join(src, 'widget', '**', '*'),
    path.join(src, 'module', '**', '*'),
    path.join(src, 'ipfs', '**', '*'),
    path.join(src, 'bos.config.json'),
    path.join(src, 'aliases.json')
  ];
}