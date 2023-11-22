export const flags = {
    bosLoaderUrl: process.env.BOS_LOADER_URL || "http://127.0.0.1:4040",
    bosLoaderWs: process.env.BOS_LOADER_WS || "ws://127.0.0.1:4040",
    enableHotReload: process.env.ENABLE_HOT_RELOAD ?? false
}
