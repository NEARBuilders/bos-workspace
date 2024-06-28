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
    bosLoaderWs: `ws://127.0.0.1:${opts.port}`,
    bosLoaderUrl: `http://127.0.0.1:${opts.port}/api/loader`,
    enableHotReload: opts.hot,
    network: opts.network,
  });

  return normalizeHtml(injectHTML(html, {
    ENV_CONFIG: {
      pattern: "%ENV_CONFIG%",
      replacement: envConfig
    },
    OTHER: {
      pattern: /<near-social-viewer><\/near-social-viewer>/g,
      replacement: true
        ? `<near-social-viewer
        ${renderAttribute("src", opts.index)}
        ${renderAttribute("rpc", `http://127.0.0.1:${opts.port}/api/proxy-rpc`)}
        ${renderAttribute("network", opts.network)}
        ></near-social-viewer>`
        : "<near-social-viewer></near-social-viewer>",
    }
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

export function modifyIndexHtml(content: string, opts: DevOptions) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  const viewer = document.querySelector('near-social-viewer');

  if (viewer) {
    viewer.setAttribute('src', opts.index);
    viewer.setAttribute('rpc', `http://127.0.0.1:${opts.port}/api/proxy-rpc`);
    viewer.setAttribute('network', opts.network);
    if (opts.hot) {
      viewer.setAttribute('enablehotreload', "");
    }
  }

  return dom.serialize();
}