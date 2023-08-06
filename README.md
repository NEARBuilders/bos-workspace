# bOS-workspace (ALPHA)

bOS-workspace is a comprehensive framework equipped with a build script that streamlines the process of managing, coding and testing bOS widgets. This script performs various operations including parsing the `bos.config.json` file, injecting content via specific comments, replacing widget sources, importing modules, generating SocialDB, and more.

## Key Features

1. Reads the `bos.config.json` file located in each `app/{appname}` folder. Note: `bos.config.json` is crucial for certain commands to function properly.
2. Utilizes special comments to inject the desired content at the right place.
3. Utilizes the aliases map from `bos.config.json` to replace comments with the correct value, it's specially useful for widget sources. For instance:

   ```json
   "aliases": {
       "nui": "nui.sking.near",
       "something": "abc"
   }
   ```

   This operation will replace all instances of the following:

   - From: `/*__@replace:something__*/` to `abc`
   - From: `<Widget src="/*__@replace:nui__*//widget/Button" />` to `<Widget src="nui.sking.near/widget/Button" />`

4. Supports module import from the `/modules` folder using the syntax: `/*__@import:moduleName__*/`. All occurrences from the mentioned syntax will be replaced with the content of `/modules/moduleName.js` and from `/*__@import:folder1/folder2/moduleName__*/` with the content of `/modules/folder1/folder2/moduleName.js`.

5. The build script also replace the following special comments:

- From `/*__@appAccount__*/` to the app account defined in `bos.config.json`.

6. File' comments can be excluded from processing by the build script by adding the following comment at the beginning of the file: `/*__@skip__*/`.

## Guidelines

- All bOS specific comments should strictly adhere to the format: `/*__@command:argument__*/` or `/*__@command__*/`.
- The comment commands are operational on `.js`, `.jsx`, `.ts`, `.tsx`, and `.jsonc` files, the only exception being `bos.config.json`.

## Project Structure

The `build.js` or `dev.js` script should execute at the project's root, and the project should maintain the following structure:

```
- apps
  - {appname}
    - bos.config.json
    - widget
        - (your widgets codes with any folder structure)
    - (other folders or files)
- modules
  - (any folder structure)
```

Each `app` represents the bOS widgets that can be deployed under the app account specified in `bos.config.json`.

Upon execution, the build script will generate a `build` folder at the project's root with the following structure:

```
- build
  - {appname}
    - src: the widgets code identical to the widget folder but prepared for deployment.
    - data.json: a JSON file that encompasses all .jsonc files from the {appname} folder, including its subfolders.
```

Example of `bos.config.json`:

```json
{
  "appAccount": "nui.sking.near",
  "aliases": {
    "nui": "nui.sking.near",
    "imageWidget": "mob.near/widget/Image",
    "something": "abc"
  }
}
```

## The `data.json` File

The `data.json` file is utilized to store data in SocialDB under the app account. It employs folders as keys and files as values, supporting only `.jsonc` and `.txt` files.

For instance, consider the following structure:

```
- apps
  - {appname}
    - something.txt
    - types
      - ui
        - imageType.jsonc
    - widget
      - Button.metadata.jsonc
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

### Excluding Files from `data.json`

The `@ignore` comment can be leveraged to omit a file from the `data.json` file. To execute this, add the following comment at the beginning of the file: `/*__@ignore__*/`.

### jsonc Files

The jsonc files will be passed through JSON.stringify and stored in the `data.json` file, the build script will also remove all the comments and spaces from the jsonc files.
If you want to skip the JSON.stringify operation, add the following comment at the beginning of the file:
`/*__@noStringify__*/`

## Development

bOS-workspace allows you to run a local server similar to `bos-loader` that can supply the widget's code to the bOS gateways for development purposes. To do so, run the following command:

```bash
# Install dependencies
yarn start
# Run the server
yarn dev
```

To access the local widgets, go to https://near.org/flags and add the following URL:
`http://127.0.0.1:4040/`

Note: The server will serve all the widgets from all the apps, each app under the account specified in `bos.config.json`. If an app uses a widget from another account that you have in the workspace, the gateway will show you the local widget instead of the remote one. That's great for working on multiple apps/accounts simultaneously.

## Build

To build the widgets for deployment, run the following command:

```bash
# Install dependencies
yarn start
# Build the widgets
yarn build
```

## Deploy

To start the deploy cli, run the following command:

```bash
yarn deploy
```

To deploy a specific app, run the following command:

```bash
yarn deploy {appname}
```

## Testing

To test the build/dev scripts, run the following command:

```bash
yarn test:tools
```

## Future Improvements (TODO)

- Implemnt deployment of `data.json` to SocialDB.
- The build script should initially try to fetch the `data.json` structure file from SocialDB and will then only generate a `data.json` file containing the new changes, bypassing the remaining files.
- Testing framework for the bOS widgets, with the ability to mock the SocialDB, near and fetch.
- Make this README.md more clear, it's a mess right now.
