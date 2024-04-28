const envConfig = document.getElementById("env-config").textContent;
const config = JSON.parse(envConfig);

export const flags = {
  bosLoaderUrl:
    process.env.BOS_LOADER_URL ||
    config.bosLoaderUrl ||
    "http://127.0.0.1:4040",
  bosLoaderWs:
    process.env.BOS_LOADER_WS || config.bosLoaderWs || "ws://127.0.0.1:4040",
  enableHotReload:
    process.env.ENABLE_HOT_RELOAD ?? config.enableHotReload ?? true,
  network:
    process.env.NETWORK || config.network || "mainnet",
};