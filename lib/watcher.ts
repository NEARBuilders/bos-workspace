import chokidar, { FSWatcher } from "chokidar";

export function startFileWatcher(watchPaths: string[], callback: Function): FSWatcher {
  const watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  watcher.on('all', (event, path) => {
		callback();
	});
  return watcher;
}