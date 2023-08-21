# bos-workspace (ALPHA)

bos-workspace is a framework to help ease the development of bOS widgets. It works like a monorepo, allowing you to develop multiple bos apps in the same time. It also provides a build script to help with the development process.

## Introduction

To use bos-workspace, simple install it:

```bash
npm install -g bos-workspace
```

Then, create a new folder with the following structure:

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

- The `apps` folder is where you store your apps. Each app has its own folder, and each app folder has a `bos.config.json` file.
- The `apps/{appname}/widget` folder is where you store your widgets. You can have any folder structure inside the `widget` folder.
- The `jsonc` files under `apps/{appname}` folder are used to create a data.json, that is used to store data under SocialDB.
- The `modules` folder is where you store your modules. You can have any folder structure inside the `modules` folder.

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

To exclude files from the `data.json` file, add the `/*__@ignore__*/` comment to the file.

#### jsonc files

The jsonc files will be passed through JSON.stringify before being stored in the `data.json` file, the build script will also remove all the comments and spaces from the jsonc files.
If you want to skip the JSON.stringify operation and keep the structure, add the following comment at the beginning of the file:
`/*__@noStringify__*/`
