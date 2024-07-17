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
npx bos-workspace dev [dest | accountId]
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
  * Pattern: `${alias_key}` ( note that you may also have other prefixes than `alias_` by configuring the `aliasPrefix` property )
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

However, there is an option to override this default gateway with a custom `/dist`. This is helpful when building widgets that utilize [custom VM elements](https://github.com/NEARBuilders/near-bos-webcomponent?tab=readme-ov-file#configuring-vm-custom-elements). To use this feature, use the `-g` flag with a path to the local custom distribution or link to package published on [nearfs](https://github.com/vgrichina/nearfs) or via cdn:

```cmd
bw dev -g path/to/dist
```

```cmd
bw dev -g https://ipfs.web4.near.page/ipfs/bafybeiancp5im5nfkdki3cfvo7ownl2knjovqh7bseegk4zvzsl4buryoi
```

This will automatically start the local gateway serving your widgets through the provided dist.

It is easy to build and distribute a custom gateway using the [near-bos-webcomponent](https://github.com/nearbuilders/near-bos-webcomponent), see ["Configuring VM Custom Elements"](https://github.com/NEARBuilders/near-bos-webcomponent?tab=readme-ov-file#configuring-vm-custom-elements).

The bos-workspace dev server is specially configured with the near-bos-webcomponent to automatically set the `rpc` attribute with the [proxy-rpc](#proxy-rpc).

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
  upload [options] [string] [string]             Upload data to SocialDB
  help [command]                                 display help for command
```

> If the gateway can't fetch local components, try disabling brave shields or your adblock.
> If the commands don't work, try again using Node >=16

## Deployment

### Usage (CLI)

**Command:** `deploy`

Deploys an app in the workspace via a convenient wrapper to [bos-cli-rs](https://github.com/bos-cli-rs/bos-cli-rs).

```cmd
bw deploy [app name] --deploy-account-id [deployAccountId] --signer-account-id [signerAccountId] --signer-public-key [signerPublicKey] --signer-private-key [signerPrivateKey]
```

* `[app name]`: Name of the app to be deployed. Assumed to be the current app in App structure (bos.config.json), but is required when using the Workspace structure (bos.workspace.json); this should match the name of the App's directory.
* `--deploy-account-id <deployAccountId>` (Optional): Account under which component code should be deployed. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

* `--signer-account-id <signerAccountId>` (Optional): Account which will be used for signing deploy transactions, frequently the same as deploy-account-id. Defaults to `config.account`, or will use `config.accounts.deploy` if specified.

* `--signer-public-key <signerPublicKey>` (Optional): Public key for signing transactions in the format: `ed25519:<public_key>`. Will default to interactive [near-cli-rs](https://github.com/near/near-cli-rs) if not provided.

* `--signer-private-key <signerPrivateKey>` (Optional): Private key for signing transactions in the format: `ed25519:<private_key>`. Will default to interactive [near-cli-rs](https://github.com/near/near-cli-rs) if not provided.

* `-n, --network <network>` (Optional): Network to deploy for (default: "mainnet").

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

Read [CONTRIBUTING](./CONTRIBUTING.md)
