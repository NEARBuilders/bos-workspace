<div align="center">

# bos-workspace

🚧 **Warning: This library has recently undergone a major refactor.** 🚧

**If this is not your first time using bos-workspace, read the [migration guide](./MIGRATION_GUIDE.md). The legacy documentation for v0.0.1-alpha.6 can be found [here](https://github.com/NEARBuilders/bos-workspace/tree/version/0.0.1-alpha.6).**

</div>

`bos-workspace` is a comprehensive toolset designed to simplify the development and deployment of [NEAR components](https://docs.near.org/bos/tutorial/quickstart) and applications. With support for hot reload, TypeScript, and multi-app management, it caters to developers looking for an efficient and scalable developer environment.

## Quickstart

To begin, either:

* [Use the template repository](https://github.com/new?template_name=quickstart&template_owner=NEARBuilders) with quickstart app, preconfigured git workflows, and playwright test suite

* Use the init command for an empty workspace:

```cmd
npx bos-workspace init
```

* Clone widgets from an existing [account](https://near.social/mob.near/widget/Everyone):

```cmd
npx bos-workspace clone [accountId] [dest]
```

* Or install `bos-workspace` within an existing project:

```cmd
yarn add -D bos-workspace
```

and ensure the proper workspace [structure and usage](#usage).

## Usage

`bos-workspace` supports both multi and single app development because of `Apps` and `Workspaces`:
  
* **App**: which belong to an Account, described by a `bos.config.json`. A structure may look like this:

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

* **Workspace**: may hold multiple apps, described by a `bos.workspace.json`

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
}
```

---

### Base Configuration

The `bos.config.json` file consists of a base configuration that defines default values and settings for the BOS environment.

* `account`: (Optional) Specifies the default account to serve widgets from. If not provided, the default value is set to `"bos.workspace"`.
* `accounts`: (Optional) Defines account configuration options for the `deploy` command.
  * `deploy`: Specifies the account to deploy widgets to.
  * `signer`: Specifies the account to sign the transaction.
* `ipfs`: (Optional) Configures IPFS settings for uploading and using local assets.
  * `gateway`: IPFS gateway to use for accessing files. Default value is `"https://ipfs.near.social/ipfs"`.
  * `uploadApi`: IPFS API endpoint to upload to. Default value is `"https://ipfs.near.social/add"`.
  * `uploadApiHeaders`: Any additional headers to send with IPFS upload API requests.
* `format`: (Optional) Indicates whether to format code on build. Default value is `true`.
* `aliases`: (Optional) Provides a list of alias files to use for replacing network-specific values with correct overrides.
* `index`: (Optional) Default widget src to use when using a custom gateway dist.  

---

### Network Overrides

The `bos.config.json` file supports network configuration overrides of this base configuration, allowing developers to specify different settings for specific networks (e.g., mainnet, testnet).

* `overrides`: (Optional) Defines overrides for network-specific configurations. These values are used via the `-n` flag in commands, respectivly:
  * `mainnet`
  * `testnet`

---

### Aliases

When working with values that differ accross different networks, developers can define aliases in separate JSON files according to environment. These aliases are replaced during build.

* **Account**: Defines the "owner" of the widgets in the workspace, according to network.
  * Pattern: `{config_account}`
* **Aliases**: Defines patterns for replacing other account and contract references. These are particularly useful for widget sources accross environments, such as using mob.near for mainnet, and mike.testnet for testnet.
  * Pattern: `${alias_key}`
  * Example:

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

## Commands

You can run `bw` or `bos-workspace` to see the list of commands.

```bash
Usage: bos-workspace [options] [command]

Build decentralized apps

Options:
  -V, --version                                  output the version number
  -h, --help                                     display help for command

Commands:
  dev [options] [src]                            Run the development server
  build [options] [src] [dest]                   Build the project
  workspace|ws [options] [command] [src] [dest]  Work with multiple apps
  init [options] [path]                          Initialize a new project
  clone [account] [dest]                         Clone a SocialDB repository
  pull [account]                                 Pull updates from a SocialDB repository
  deploy [options] [appName]                     Deploy the project
  upload [string]                                Upload data to SocialDB (not implemented)
  help [command]                                 display help for command
```

> If the gateway can't fetch local components, try disabling brave shields or your adblock.
> If the commands don't work, try again using Node >=16

## Deployment

**Command:** `deploy`

Deploys an app in the workspace via a convenient wrapper to [bos-cli-rs](https://github.com/bos-cli-rs/bos-cli-rs).

### Usage (CLI)

Deploy the project with the option to specify an app name (must be the name of the folder in the /apps directory):

```cmd
bos-workspace deploy [app name] --deploy-account-id [deployAccountId] --signer-account-id [signerAccountId] --signer-public-key [signerPublicKey] --signer-private-key [signerPrivateKey]
```

### Options

* `--deploy-account-id <deployAccountId>` (Optional): Account under which component code should be deployed. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

* `--signer-account-id <signerAccountId>` (Optional): Account which will be used for signing deploy transactions, frequently the same as deploy-account-id. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

* `--signer-public-key <signerPublicKey>` (Required): Public key for signing transactions in the format: `ed25519:<public_key>`.

* `--signer-private-key <signerPrivateKey>` (Required): Private key in `ed25519:<private_key>` format for signing transactions.

* `-n, --network <network>` (Optional): Network to deploy for (default: "mainnet").

## Configuring git workflows

### Prerequisites

1. Must be upgraded to bos-workspace v1, see the [migration guide](?page=getting_started/migration_guide)
2. Specify testnet [overrides + aliases](?page=usage/aliases) in bos.config.json.


### Mainnet

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

### Testnet

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

Read [CONTRIBUTING](./CONTRIBUTING.md)
