import { DevOptions } from "./dev";
import axios from "axios";

import { JSDOM } from "jsdom";

function renderAttribute(name, value) {
  return value !== undefined ? `${name}="${value}"` : "";
}

function htmlStringify(json) {
  return JSON.stringify(json)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const handleReplacements = (html: string, opts: DevOptions): string => {
  const envConfig = JSON.stringify({
    enableHotReload: opts.hot,
    network: opts.network,
  });

  return normalizeHtml(injectHTML(html, {
    ENV_CONFIG: {
      pattern: "%ENV_CONFIG%",
      replacement: envConfig
    },
  }));
}

function injectHTML(html: string, injections: Record<string, any>) {
  Object.keys(injections).forEach((key) => {
    const { pattern, replacement } = injections[key];
    html = html.replace(pattern, replacement);
  });
  return html;
};

function normalizeHtml(html) {
  return html.replace(/\s+/g, ' ').trim();
}

const contentCache = {};

export async function fetchAndCacheContent(url) {
  if (!contentCache[url]) {
    const response = await axios.get(url);
    contentCache[url] = response.data;
  }
  return contentCache[url];
}

export async function modifyIndexHtml(content: string, opts: DevOptions, manifest: any) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  const loadedScripts = new Set();

  function loadScript(src) {
    return new Promise<void>((resolve, reject) => {
      if (loadedScripts.has(src)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        loadedScripts.add(src);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const container = document.getElementById("bw-root");

  let elementTag = "near-social-viewer";

  let elementSrc = opts.gateway as string;
  const url = elementSrc.replace(/\/$/, "");

  try {
    // Fetch and cache the manifest if not already cached
    // manifest = await fetchAndCacheContent(`${url}/asset-manifest.json`);
    // console.debug(`Received manifest: ${manifest}`);

    const runtimeSrc = `${url}/${manifest.entrypoints[0]}`;
    const mainSrc = `${url}/${manifest.entrypoints[1]}`;

    await loadScript(runtimeSrc);
    await loadScript(mainSrc);

    const element = document.createElement(elementTag);
    container.appendChild(element);
    element.setAttribute("src", opts.index);
    element.setAttribute("rpc", `http://127.0.0.1:${opts.port}/api/proxy-rpc`);
    element.setAttribute("network", opts.network);

    const config = {
      dev: {
        hotreload: {
          enabled: opts.hot
        }
      },
      vm: {
        features: {
          enableComponentSrcDataKey: true
        }
      }
    };

    element.setAttribute('config', JSON.stringify(config));
  } catch (error) {
    log.error(`Error fetching or processing manifest: ${error}`);
    // Handle error appropriately, e.g., log or throw
    throw error;
  }

  return dom.serialize();
}
