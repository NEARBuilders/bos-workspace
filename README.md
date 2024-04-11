<center>

# bos-workspace

🚧 **Warning: This library has recently undergone a major refactor.** 🚧

**If this is not your first time using bos-workspace, read the [migration guide](./MIGRATION_GUIDE.md). The legacy documentation for v0.0.1-alpha.6 can be found [here](https://github.com/NEARBuilders/bos-workspace/tree/version/0.0.1-alpha.6).**

</center>

`bos-workspace` is a comprehensive toolset designed to simplify the development and deployment of [NEAR components](https://docs.near.org/bos/tutorial/quickstart) and applications. With support for hot reload, TypeScript, and multiple app management, it caters to developers looking for an efficient and scalable developer environment.

## Quickstart

To begin, either [use this template repository](https://github.com/new?template_name=quickstart&template_owner=NEARBuilders) or install `bos-workspace` within an existing project:

```cmd
yarn add -D bos-workspace
```

Then, you can clone widgets from an existing [account](https://near.social/mob.near/widget/Everyone) via:

```bash
yarn run bos-workspace clone [accountId]
```

Or ensure the proper workspace [structure and usage](#usage).

### Usage

`bos-workspace` supports both multi and single app development because of `Apps` and `Workspaces`:
  
* **App**: which belong to an Account, described by a `bos.config.json`. A structure may look like this:

```txt
app.near/
├── widget/
│   └── example.jsx
└── bos.config.json
```

where the content of `bos.config.json` is:

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
