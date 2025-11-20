<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD029 -->

<div align="center">

<h1 style="font-size: 2.5rem; font-weight: bold;">bos-workspace</h1>

  <p>
    <strong>Local workspace for <a href="https://near.org/blog/near-announces-the-blockchain-operating-system" target="_blank">NEAR BOS</a> development</strong>
  </p>

</div>

`bos-workspace` is a comprehensive toolset designed to simplify the development and deployment of [NEAR components](https://docs.near.org/bos/tutorial/quickstart) and applications. With support for hot reload, TypeScript, and multi-app management, it caters to developers looking for an efficient and scalable developer environment.

> [!WARNING]  
> 🚧 **Notice: This library has recently undergone a major refactor.** 🚧
>
> **If this is not your first time using bos-workspace, read the [migration guide](./MIGRATION_GUIDE.md). The legacy documentation for v0.0.1-alpha.6 can be found [here](https://github.com/NEARBuilders/bos-workspace/tree/version/0.0.1-alpha.6).**

<details>
  <summary>Table of Contents</summary>

- [Quickstart](#quickstart)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Base Configuration](#base-configuration)
  - [Network Overrides](#network-overrides)
  - [Aliases](#aliases)
    - [Custom alias prefix](#custom-alias-prefix)
- [Customizing the Gateway](#customizing-the-gateway)
- [Deploying to Web4](#deploying-to-web4)
- [Commands](#commands)
- [Deployment](#deployment)
  - [Usage (CLI)](#usage-cli)
  - [Usage (Git Workflow)](#usage-git-workflow)
    - [Prerequisites](#prerequisites)
    - [Mainnet](#mainnet)
    - [Testnet](#testnet)
- [API Endpoints](#api-endpoints)
  - [Gateway Frontend](#gateway-frontend)
  - [Loader API](#loader-api)
  - [WebSocket](#websocket)
  - [Proxy RPC](#proxy-rpc)
- [Contributing](#contributing)

</details>

## Quickstart

To begin, either:

- [Use the template repository](https://github.com/new?template_name=quickstart.near&template_owner=NEARBuilders) with quickstart app, preconfigured git workflows, and playwright test suite

- Use the init command for an empty workspace:

```cmd
npx bos-workspace init
```

- Clone widgets from an existing [account](https://near.social/mob.near/widget/Everyone):

```cmd
npx bos-workspace clone [accountId] [dest]
npx bos-workspace dev [dest | accountId]
```

- Or install `bos-workspace` within an existing project:

```cmd
yarn add -D bos-workspace
```

and ensure the proper workspace [structure and usage](#usage).

## Usage

`bos-workspace` supports both multi and single app development because of `Apps` and `Workspaces`:
  
- **App**: which belong to an Account, described by a `bos.config.json`. A structure may look like this:

```txt
app.near/
├── widget/
│   └── example.jsx
└── bos.config.json
```

where the content of `bos.config.json` is (at least):

```json
{
  "account": "app.near"
}
```

- **Workspace**: may hold multiple apps, described by a `bos.workspace.json`

```txt
apps/
├── app1.near/
│   ├── widget/
│   │   └── example.jsx
│   └── bos.config.json
├── app2.near/
│   ├── widget/
│   │   └── example.jsx
│   └── bos.config.json
bos.workspace.json
```

where the content of `bos.workspace.json` is:

```json
{
  "apps": ["/apps/*"]
}
```

**Note:** The "app name" is not required to end in `.near`, and apps don't necessarily have to be stored in a directory named `/apps`. What's important is that the `bos.config.json` is located at the same level as directories such as `/widget`, and that `bos.workspace.json` specifies the directory it resides in.

## Configuration

The `bos.config.json` file serves as the configuration file for managing various settings and options related to the workspace.

A fully featured config may look like this:

```json
{
  "account": "quickstart.near",
  "aliases": ["./aliases.mainnet.json"],
  "index": "quickstart.near/widget/home",
  "overrides": {
    "testnet": {
      "account": "quickstart.testnet",
      "aliases": ["./aliases.testnet.json"],
      "index": "quickstart.testnet/widget/home"
    }
  },
  "accounts": {
    "deploy": "quickstart.near",
    "signer": "devs.near",
  },
  "format": true,
  "ipfs": {
    "gateway": "https://ipfs.near.social/ipfs",
    "uploadApi": "https://ipfs.near.social/add",
    "uploadApiHeaders": {},
  },
  "gateway": {
    "bundleUrl": "https://ipfs.web4.near.page/ipfs/bafybeibe63hqugbqr4writdxgezgl5swgujay6t5uptw2px7q63r7crk2q/",
    "tagName": "near-social-viewer"
  }
}
```

---

### Base Configuration

The `bos.config.json` file consists of a base configuration that defines default values and settings for the BOS environment.

- `account`: (Optional) Specifies the default account to serve widgets from. If not provided, the default value is set to `"bos.workspace"`.
- `accounts`: (Optional) Defines account configuration options for the `deploy` command.
  - `deploy`: Specifies the account to deploy widgets to.
  - `signer`: Specifies the account to sign the transaction.
- `ipfs`: (Optional) Configures IPFS settings for uploading and using local assets.
  - `gateway`: IPFS gateway to use for accessing files. Default value is `"https://ipfs.near.social/ipfs"`.
  - `uploadApi`: IPFS API endpoint to upload to. Default value is `"https://ipfs.near.social/add"`.
  - `uploadApiHeaders`: Any additional headers to send with IPFS upload API requests.
- `format`: (Optional) Indicates whether to format code on build. Default value is `true`.
- `aliases`: (Optional) Provides a list of alias files to use for replacing network-specific values with correct overrides.
- `index`: (Optional) Default widget src to use when using a custom gateway dist.  
- `gateway`: (Optional) Configures gateway object.
  - `bundleUrl`: gateway url.
  - `tagName`: element tag name.

---

### Network Overrides

The `bos.config.json` file supports network configuration overrides of this base configuration, allowing developers to specify different settings for specific networks (e.g., mainnet, testnet).

- `overrides`: (Optional) Defines overrides for network-specific configurations. These values are used via the `-n` flag in commands, respectivly:
  - `mainnet`
  - `testnet`

---

### Aliases

When working with values that differ accross different networks, developers can define aliases in separate JSON files according to environment. These aliases are replaced during build.

- **Account**: Defines the "owner" of the widgets in the workspace, according to network.
  - Pattern: `{config_account}`
- **Aliases**: Defines patterns for replacing other account and contract references. These are particularly useful for widget sources accross environments, such as using mob.near for mainnet, and mike.testnet for testnet.
  - Pattern: `${alias_key}` ( note that you may also have other prefixes than `alias_` by configuring the `aliasPrefix` property )
  - Example:

    ```json
    {
      "account": "[MAINNET_ACCOUNT_ID]",
      "aliases": ["./aliases.mainnet.json"],
      "overrides": {
        "testnet": {
          "account": "[TESTNET_ACCOUNT_ID]",
          "aliases": ["./aliases.testnet.json"]
        }
      }
    }
    ```

    with accompaning jsons:

    `aliases.mainnet.json`

    ```json
    {
      "devs": "devs.near",
      "mob": "mob.near",
    }
    ```

    `aliases.testnet.json`

    ```json
    {
      "devs": "neardevs.testnet",
      "mob": "mike.testnet"
    }
    ```

#### Custom alias prefix

If your aliases are prefixed with another keyword than `alias`, you may configure this using the `aliasPrefix` property. You may also include the prefix in the keys of your alias json file. Here is an example:

 ```json
  {
    "account": "[MAINNET_ACCOUNT_ID]",
    "aliases": ["./aliases.mainnet.json"],
    "aliasPrefix": "REPL",
    "aliasesContainsPrefix": true,
  }
```

and then with your `aliases.mainnet.json` like this:

```json
{
  "REPL_NAME": "world"
}
```

If your widget file looks like this:

```tsx
export default <h1>Hello ${REPL_NAME}!</h1>;
```

Then the alias will be replaced like this:

```tsx
export default <h1>Hello world!</h1>;
```

## Customizing the Gateway

Running the bos-workspace dev server will start a local gateway with a standard [near-social-vm](https://github.com/NearSocial/VM) installed unless the `--no-gateway` flag is provided in your dev command:

```cmd
bw dev --no-gateway
```

However, there is an option to override this default gateway with a custom `/dist`. This is helpful when building widgets that utilize [custom VM elements](https://github.com/NEARBuilders/near-bos-webcomponent?tab=readme-ov-file#configuring-vm-custom-elements). To use this feature, specify the gateway bundle url and the tag name in the `bos.config.json` file.

```cmd
"gateway": {
  "bundleUrl": "https://ipfs.web4.near.page/ipfs/bafybeibe63hqugbqr4writdxgezgl5swgujay6t5uptw2px7q63r7crk2q/",
  "tagName": "near-social-viewer"
}
```

This will automatically start the local gateway serving your widgets through the provided dist.

It is easy to build and distribute a custom gateway using the [near-bos-webcomponent](https://github.com/nearbuilders/near-bos-webcomponent), see ["Configuring VM Custom Elements"](https://github.com/NEARBuilders/near-bos-webcomponent?tab=readme-ov-file#configuring-vm-custom-elements).

The bos-workspace dev server is specially configured with the near-bos-webcomponent to automatically set the `rpc` attribute with the [proxy-rpc](#proxy-rpc).

## Deploying to Web4

If you specify an `index` in your bos.config.json, then bos-workspace will display your widgets through the latest version of [near-bos-webcomponent](https://github.com/nearbuilders/near-bos-webcomponent), or the gateway provided via the `-g` flag.

This involves some html manipulation in order to set the web component's attributes. The html that is created can be found in the designated destination (defaults to `/build`). This html can be used to easily deploy your site with widgets to [web4](https://github.com/vgrichina/web4).

1. Be sure to have deployed a web4 smart contract, such as the [web4-min-contract](https://github.com/vgrichina/web4-min-contract)
2. Move the output index.html to your `/public` or `/dist` if not using a bundler.
3. [TEMP] Remove the rpc and config attributes from `near-social-viewer` element.
4. Run [web4 deploy](https://github.com/vgrichina/web4-deploy) with src being the directory that holds this index.html and the account you have a contract deployed to.

**This is a rough first draft of the implementation and will be improved upon.**

## Commands

You can run `bw` or `bos-workspace` to see the list of commands.

```bash
Usage: bos-workspace [options] [command]

Build decentralized apps

Options:
  -V, --version                                  output the version number
  -h, --help                                     display help for command

Commands:
  dev [options] [src] [dest]                     Run the development server
  build [options] [src] [dest]                   Build the project
  workspace|ws [options] [command] [src] [dest]  Work with multiple apps
  init [options]                                 Initialize a new project
  clone [account] [dest]                         Clone a SocialDB repository
  deploy [options] [appName]                     Deploy the project
  upload [options] [appName]                     Upload data to SocialDB
  help [command]                                 display help for command
```

> If the gateway can't fetch local components, try disabling brave shields or your adblock.
> If the commands don't work, try again using Node >=16

## Deployment

### Usage (CLI)

**Command:** `deploy`

Deploys an app in the workspace via a convenient wrapper to [bos-cli-rs](https://github.com/bos-cli-rs/bos-cli-rs). It's also possible to add an optional string array in the `bos.config.json` to specify the data to upload:

```json
  "data": {
    "include": ["folder"]
  }
```

The upload script will bundle all the json files inside the specified folder and upload the data with the app.

```cmd
bw deploy [app name] --deploy-account-id [deployAccountId] --signer-account-id [signerAccountId] --signer-public-key [signerPublicKey] --signer-private-key [signerPrivateKey]
```

- `[app name]`: Name of the app to be deployed. Assumed to be the current app in App structure (bos.config.json), but is required when using the Workspace structure (bos.workspace.json); this should match the name of the App's directory.
- `--deploy-account-id <deployAccountId>` (Optional): Account under which component code should be deployed. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

- `--signer-account-id <signerAccountId>` (Optional): Account which will be used for signing deploy transactions, frequently the same as deploy-account-id. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

- `--signer-public-key <signerPublicKey>` (Optional): Public key for signing transactions in the format: `ed25519:<public_key>`. Will default to interactive [near-cli-rs](https://github.com/near/near-cli-rs) if not provided.

- `--signer-private-key <signerPrivateKey>` (Optional): Private key for signing transactions in the format: `ed25519:<private_key>`. Will default to interactive [near-cli-rs](https://github.com/near/near-cli-rs) if not provided.

- `-n, --network <network>` (Optional): Network to deploy for (default: "mainnet").

### Usage (Git Workflow)

#### Prerequisites

1. Must be upgraded to bos-workspace v1, see the [migration guide](./MIGRATION_GUIDE.md)
2. Specify testnet [overrides + aliases](#aliases) in bos.config.json.

#### Mainnet

1. Create `.github/workflow/release-mainnet.yml`

```yml
name: Deploy Components to Mainnet
on:
  push:
    branches: [main]
jobs:
  deploy-mainnet:
    uses: NEARBuilders/bos-workspace/.github/workflows/deploy.yml@main
    with:
      bw-legacy: false
      deploy-env: "mainnet"
      app-name: "[APP_NAME]"
      deploy-account-address: "[DEPLOY_ACCOUNT]"
      signer-account-address: "[SIGNER_ACCOUNT]"
      signer-public-key: [PUBLIC_KEY]
    secrets:
      SIGNER_PRIVATE_KEY: ${{ secrets.SIGNER_PRIVATE_KEY }} // then configure this in your Github/Settings/Actions
```

#### Testnet

1. Create `.github/workflow/release-testnet.yml`

```yml
name: Deploy Components to Testnet
on:
  push:
    branches: [develop]
jobs:
  deploy-mainnet:
    uses: NEARBuilders/bos-workspace/.github/workflows/deploy.yml@main
    with:
      bw-legacy: false
      build-env: "testnet"
      deploy-env: "testnet"
      app-name: "[APP_NAME]"
      deploy-account-address: "[DEPLOY_ACCOUNT]" // testnet account
      signer-account-address: "[SIGNER_ACCOUNT]"
      signer-public-key: [PUBLIC_KEY] 
    secrets:
      SIGNER_PRIVATE_KEY: ${{ secrets.SIGNER_PRIVATE_KEY }} // then configure this in your Github/Settings/Actions
```

Reference: [quickstart](https://github.com/nearbuilders/quickstart)

## API Endpoints

A running `bos-workspace` server exposes several endpoints for interacting with local data:

### Gateway Frontend

**URL:** `http://127.0.0.1:8080/`

-> Provides a frontend interface for viewing and interacting with widgets.

### Loader API

**URL:** `http://127.0.0.1:8080/api/loader`

**Method:** `POST`

-> Receive all built and served data.

### WebSocket

**URL:** `ws://127.0.0.1:8080/`

-> WebSocket for hot reload, delivers most updated data.

### Proxy RPC

**URL:** `http://127.0.0.1:8080/api/proxy-rpc`

-> Proxies RPC requests, use as rpcUrl in [near-api-js](https://github.com/near/near-api-js).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you're interested in contributing to this project, please read the [contribution guide](./CONTRIBUTING).

<div align="right">
  <a href="https://nearbuilders.org" target="_blank">
    <img
      src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
      alt="Near Builders"
      height="40"
    />
  </a>
</div>
