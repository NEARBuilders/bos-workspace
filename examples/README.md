# Examples

This folder contains example apps demonstrating the various functionalities and use cases of the bos-workspace CLI. They serve as a reference for users to understand how to interact with the tool and leverage its features, as well as an environemnt for testing changes during development of this tool.

## Contents

- `/single`: Demonstrates basic usage of a single App. It is a reproduction of the [Guest Book](https://docs.near.org/tutorials/examples/guest-book) and is configured with aliases in both mainnet and testnet.
- `/multi`: Demonstrates basic usage of a Workspace with multiple apps. The `bos.workspace.json` makes reference to two simple Apps.

## Usage

To use these examples while developing the CLI locally, follow the below steps:

1. From the root directory, ensure that you have installed the necessary dependencies, `yarn`
2. Run the `dev` script to watch for changes, `yarn dev`
3. Run one of the examples, referencing the local cli, e.g. `../bin/bw.js dev` or  `../bin/bw.js ws dev`
