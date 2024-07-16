import { DevOptions } from "./dev";

import { JSDOM } from "jsdom";


type IpfsCid = string;

interface Image {
  ipfs_cid: IpfsCid;
}

interface Linktree {
  twitter?: string;
  github?: string;
  telegram?: string;
  website?: string;
  [key: string]: string | undefined; // For any additional social links
}

interface Tags {
  [key: string]: string | undefined;
}

export interface Metadata {
  name: string;
  description: string;
  image: Image;
  backgroundImage: Image;
  linktree: Linktree;
  tags: Tags;
}
export function modifyIndexHtml(content: string, opts: DevOptions, dependencies: string[], metadata: Metadata) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  // Metadata replacements
  document.title = metadata.name;
  document.querySelector('meta[name="description"]').setAttribute('content', metadata.description);
  document.querySelector('meta[name="keywords"]').setAttribute('content', Object.keys(metadata.tags).join(', '));
  document.querySelector('meta[name="author"]').setAttribute('content', metadata.name);

  document.querySelector('meta[property="og:title"]').setAttribute('content', metadata.name);
  document.querySelector('meta[property="og:description"]').setAttribute('content', metadata.description);
  document.querySelector('meta[property="og:image"]').setAttribute('content', `https://ipfs.io/ipfs/${metadata.image.ipfs_cid}`);
  document.querySelector('meta[property="og:site_name"]').setAttribute('content', metadata.name);

  document.querySelector('meta[name="twitter:site"]').setAttribute('content', `@${metadata.linktree.twitter || ''}`);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', metadata.name);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', metadata.description);
  document.querySelector('meta[name="twitter:image"]').setAttribute('content', `https://ipfs.io/ipfs/${metadata.image.ipfs_cid}`);

  document.querySelector('link[rel="icon"]').setAttribute('href', `https://ipfs.io/ipfs/${metadata.image.ipfs_cid}`);

  // Add script tags for each dependency
  dependencies.forEach((dependency: string) => {
    const script = document.createElement('script');
    script.src = dependency;
    script.defer = true;
    document.head.appendChild(script);
  });

  const elementTag = "near-social-viewer";

  // Create and configure the near-social-viewer element
  const container = document.getElementById("bw-root");
  const element = document.createElement(elementTag); // this could be configurable
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

  // Add wallet selector

  // Stylesheet
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = 'https://cdn.jsdelivr.net/npm/@near-wallet-selector/modal-ui-js@8.7.2/styles.css';
  document.head.appendChild(styleLink);

  // Import wallets and setup selector
  const webcomponentapp = document.createElement('script');
  webcomponentapp.textContent = `
  import { setupWalletSelector } from "@near-wallet-selector/core";
  import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
  import { setupHereWallet } from "@near-wallet-selector/here-wallet";
  import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
  import { setupSender } from "@near-wallet-selector/sender";
  import { setupNightly } from "@near-wallet-selector/nightly";
  import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";

  const selector = await setupWalletSelector({
    network: "${opts.network}",
    modules: [
      setupMyNearWallet(),
      setupHereWallet(),
      setupMeteorWallet(),
      setupSender(),
      setupNightly(),
      setupMintbaseWallet()
    ],
  });

  const viewer = document.querySelector("${elementTag}");
  viewer.selector = selector;
`;
  webcomponentapp.type = 'module';
  document.body.appendChild(webcomponentapp);

  return dom.serialize();
}

// // This should be modified to only run when necessary... only needs to be done when initializing the project 
// // or when the dependencies change (which could just be managed by here... really just need to add it to the json.)
// export async function importPackages(html: string): Promise<string> {
//   try {
//     const { Generator } = await import('@jspm/generator');
//     const generator = new Generator();
//     return await generator.htmlInject(html, {
//       trace: true,
//       esModuleShims: true
//     });
//   } catch (error) {
//     console.error('Error importing or using @jspm/generator:', error);
//     return html; // Return original HTML if there's an error
//   }
// }