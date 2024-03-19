# Migration Guide

## 0.0.1-alpha.x to 1.0.0-alpha

This upgrade introduces some name changes, a new replacements strategy, and a more modular approach with apps and workspaces.

To use the latest version, you may maintain your current app's structure, but must make the following changes:

1. In every app's `bos.config.json`, rename "appAccount" to "account"
2. Any widget utilizing replacements with `/*__@appAccount__*/` should replace with `${config_account}`. Aliases should be replaced with `${alias_ALIASKEY}`.

### `bos.config.json`

### OLD

```json
{
  "appAccount": "potlock.near",
  "aliases": {
    "nui": "nearui.near"
  }
}
```

### NEW

```json
{
  "account": "potlock.near",
  "aliases": ["./aliases.mainnet.json"],
  "overrides": {
    "testnet": {
      "account": "potlock.testnet",
      "aliases": ["./aliases.testnet.json"]
    },
    "staging": {
      "account": "staging.potlock.near",
      "aliases": ["./aliases.staging.json"]
    }
  }
}
```

Then define your aliases according to environment.

If you decide to maintain the structure of your workspace (e.g. `/apps`), add a `bos.workspace.json` with content:

```json
{
  "apps": ["/apps/*"]
}
```
