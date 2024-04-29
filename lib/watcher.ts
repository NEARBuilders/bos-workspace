import { Gaze } from "gaze";

export function startFileWatcher(watchPaths: string[], callback: Function) {
  const gaze = new Gaze(watchPaths, { debounceDelay: 100 });
  // @ts-ignore
  gaze.on("all", callback);
}