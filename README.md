# bos-workspace (ALPHA)

🚧 **Warning: This library is in alpha and may undergo significant changes.** 🚧

## Getting Started

To use bos-workspace, install it globally or in your existing workspace:

```cmd
> npm install bos-workspace
```

Or download and run [create-bos-app](https://github.com/archetype-org/create-bos-app).  ( [integrate create-bos-app #41](https://github.com/NEARBuilders/bos-workspace/issues/41) )

```cmd
> npm install create-bos-app
> create-bos-app
```

## Features

  - [x] Alias Mapping
  - [x] Gateway for local development (without needing flags)
  - [x] Hot Reload
  - [x] Typescript support
  - [x] Deploy widgets via Github Action
  - [x] Manage multiple apps configured with different root accountIds
  - [x] Support for flags on other gateways


### Commands

You can run `bw` or `bos-workspace` to see the list of commands.

```bash
Usage: bos-workspace [options] [command]

BOS Workspace CLI

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  dev             Run the development server
  build           Build the project
  deploy          Deploy the project
  upload          Upload data to SocialDB
```

> If the gateway can't fetch local components, try disabling brave shields or your adblock.
> If the commands don't work, try again using Node >=16

## Key Features

### 1. **App Configuration**

In the `bos.config.json` file, you can specify the app account. It will be used as for development and deployment. And the build script will replace the `/*__@appAccount__*/` comment with the app account.

### 2. **Alias Mapping**

The aliases from `bos.config.json` are used to replace comments with correct values, useful for widget sources.

For example:

```json
"aliases": {
    "nui": "nui.sking.near",
    "something": "abc"
}
```

Replacements:

- `/*__@replace:something__*/` to `abc`
- `<Widget src="/*__@replace:nui__*//widget/Button" />` to `<Widget src="nui.sking.near/widget/Button" />`

### 3. **Module Importing**

The build script will replace `/*__@import:moduleName__*/` with the module's source code from the `modules` folder.

### 4. **Exclude Files**

The build script will exclude files that have `/*__@skip__*/` comment.

### 5. **Data.json**

The build script will create a `data.json` file based on the `jsonc` and `txt` files under `apps/{appname}` folder. The `data.json` file will be used to store data under SocialDB.

For instance, consider the following structure:

```js
-apps -
  { appname } -
  something.txt -
  types -
  ui -
  imageType.jsonc -
  widget -
  Button.metadata.jsonc;
```

The `data.json` file will appear as follows:

```json
{
  "something": "unchanged content of something.txt",
  "types": {
    "ui": {
      "imageType": "Stringified JSON content of imageType.jsonc"
    }
  },
  "widget": {
    "Button.metadata": "Stringified JSON content of Button.metadata.jsonc"
  }
}
```

To exclude files from the `data.json` file, add the `/*__@ignore__*/` comment to the file.

#### jsonc files

The jsonc files will be passed through JSON.stringify before being stored in the `data.json` file, the build script will also remove all the comments and spaces from the jsonc files.
If you want to skip the JSON.stringify operation and keep the structure, add the following comment at the beginning of the file:
`/*__@noStringify__*/`

To use the [reusable workflow for deploying your apps](./.gitignore/workflows/deploy.yml) This workspace comes with a reusable workflow for deploying an app.

Here's the cleaned-up documentation in Markdown:

## Deploying Widgets through GitHub Actions

To deploy widgets on push to branch, create a GitHub Actions workflow file in your repository, e.g., `.github/workflows/deploy-embeds-mainnet.yml`, and configure it as follows:

```yaml
name: Deploy 'AppName' App Components to Mainnet

on:
  push:
    branches: [main] // branch for trigger

jobs:
  deploy-mainnet:
    uses: NEARBuilders/bos-workspace/.github/workflows/deploy.yml@main
    with:
      deploy-env: "mainnet"  // environemnt to deploy to
      app-name: "embeds" // app name with bos.config.json
      deploy-account-address: ${{ vars.DEPLOY_ACCOUNT_ID }} // should match bos.config.json (TODO fix this)
      signer-account-address: ${{ vars.SIGNER_ACCOUNT_ID }} // account to sign with
      signer-public-key: ${{ vars.SIGNER_PUBLIC_KEY }}
      signer-private-key: ${{ secrets.SIGNER_PRIVATE_KEY }}
```

Adjust the workflow as needed, then configure your variables + secrets on GitHub Settings -> Actions -> secrets & variables. Use [near-cli-rs](https://github.com/near/near-cli-rs) for generating keypairs.

### Workflow Inputs

The workflow accepts the following inputs:

- `cli-version` (optional): Version of BOS CLI to use for deployment (e.g., 0.3.0). Default: "0.3.6"

- `deploy-env` (optional): Environment to deploy component code to (e.g., mainnet, testnet). Default: "mainnet"

- `app-name` (required): Workspace app name to deploy (from the /apps directory).

- `deploy-account-address` (required): Account under which component code should be deployed.

- `signer-account-address` (required): Account used for signing the deploy transaction, frequently the same as `deploy-account-address`.

- `signer-public-key` (required): Public key for signing transactions in the format: `ed25519:<public_key>`.

- `signer-private-key` (required): Private key for signing transactions in the format: `ed25519:<private_key>`.
