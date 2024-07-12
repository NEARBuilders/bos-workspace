import { DevOptions } from "./dev";

import { JSDOM } from "jsdom";

export function modifyIndexHtml(content: string, opts: DevOptions, dependencies: string[]) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  // Add script tags for each dependency
  dependencies.forEach((dependency: string) => {
    const script = document.createElement('script');
    script.src = dependency;
    script.defer = true;
    document.head.appendChild(script);
  });

  // Create and configure the near-social-viewer element
  const container = document.getElementById("bw-root");
  const element = document.createElement("near-social-viewer"); // this could be configurable
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

  container.appendChild(element);

  return dom.serialize();
}
