# bos-workspace

`bos-workspace` is a comprehensive toolset designed to simplify the development and deployment of [NEAR components](https://docs.near.org/bos/tutorial/quickstart) and applications. With support for hot reload, TypeScript, and multiple app management, it caters to developers looking for an efficient and scalable development environment.

## Quickstart

### Installation

You can install `bos-workspace` globally on your machine or within your existing project workspace using npm (or other package manager):

```cmd
npm install bos-workspace
```

Alternatively, to scaffold a new project, use the `create-bos-app` command. This utility sets up a new application and installs all necessary dependencies to provide a ready-to-use development environment:

```cmd
npx @archetype-org/create-bos-app
```

( [create-bos-app](https://github.com/archetype-org/create-bos-app) will soon be absorbed into bos-workspace [#41](https://github.com/NEARBuilders/bos-workspace/issues/41) )

### Usage

`bos-workspace` supports both multi and single app development-- workspaces are composable.

For single applications, place a `bos.config.json` with an "account" defined.
For multi applications, place a `bos.workspace.json` in your root.

## Features

- [x] Alias Mapping
- [x] Gateway for local development (without needing flags)
- [x] Hot Reload
- [x] TypeScript support
- [x] Deploy widgets via GitHub Action
- [x] Manage multiple apps configured with different root accountIds
- [x] Support for flags on other gateways

### Commands

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
  deploy [string]                                Deploy the project (not implemented)
  upload [string]                                Upload data to SocialDB (not implemented)
  help [command]                                 display help for command
```

> If the gateway can't fetch local components, try disabling brave shields or your adblock.
> If the commands don't work, try again using Node >=16



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
