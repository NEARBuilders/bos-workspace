import Joi from 'joi';
import { readJson } from '@/lib/utils/fs';
import { Network } from './types';
import path from 'path';
import { GatewayConfigObject } from './dev';

export interface BaseConfig {
  account?: string; // default account to serve widgets from
  accounts?: { // account configuration (used for deploy command)
    deploy?: string; // account to deploy widgets to
    signer?: string; // account to sign transactions (such as deployment)
    dev?: string; 
  };
  ipfs?: { // ipfs configuration
    gateway?: string; // ipfs gateway to use
    uploadApi?: string; // ipfs upload api
    uploadApiHeaders?: Record<string, string>; // headers to send with ipfs upload api
  };
  format?: boolean; // option to format code on build (default true)
  aliases?: string[]; // list of alias to use
  index?: string; // widget to use as index
  aliasPrefix?: string; // prefix to use for aliases, default is "alias"
  aliasesContainsPrefix?: boolean; // aliases keys contains prefix (default is false)
	gateway?: GatewayConfigObject // gateway config object
}

interface NetworkConfig {
  mainnet?: BaseConfig;
  testnet?: BaseConfig;
}

interface AppConfig extends BaseConfig {
  overrides?: NetworkConfig;
}

export const DEFAULT_CONFIG = {
  account: "bos.workspace",
  format: true,
  ipfs: {
    gateway: "https://ipfs.near.social/ipfs",
    uploadApi: "https://ipfs.near.social/add",
    uploadApiHeaders: {},
  },
  aliases: ["./aliases.json"],
};

// Base configuration schema
const accountConfigSchema = Joi.object({
  deploy: Joi.string().allow(null),
  signer: Joi.string().allow(null),
  dev: Joi.string().allow(null),
});

const baseConfigSchema = Joi.object({
  account: Joi.string().default(DEFAULT_CONFIG.account).allow(null),
  accounts: accountConfigSchema,
  ipfs: Joi.object({
    gateway: Joi.string().default(DEFAULT_CONFIG.ipfs.gateway).allow(null),
    uploadApi: Joi.string().default(DEFAULT_CONFIG.ipfs.uploadApi).allow(null),
    uploadApiHeaders: Joi.object().default(DEFAULT_CONFIG.ipfs.uploadApiHeaders),
  }).default(DEFAULT_CONFIG.ipfs),
  format: Joi.boolean().default(DEFAULT_CONFIG.format),
  aliases: Joi.array().items(Joi.string()).default(DEFAULT_CONFIG.aliases),
  aliasPrefix: Joi.string().allow(null),
  aliasesContainsPrefix: Joi.boolean().allow(null),
  index: Joi.string().allow(null),
	gateway: Joi.object({
		tagName: Joi.string(),
		bundleUrl: Joi.string(),
	}).and('tagName', 'bundleUrl').allow(null),
});

const networkConfigSchema = Joi.object({
  mainnet: baseConfigSchema.allow(null),
  testnet: baseConfigSchema.allow(null),
});

const configSchema = baseConfigSchema.keys({
  overrides: networkConfigSchema.default({}),
});

export async function readConfig(srcOrJson: string | object, network: keyof NetworkConfig = 'mainnet'): Promise<AppConfig> {
  let data = srcOrJson;
  if (typeof srcOrJson === 'string') {
    data = await readJson(srcOrJson);
  }
  const { error, value: config } = configSchema.validate(data, {
    stripUnknown: true,
  })
  if (error) {
    throw error;
  }

  const overrides = fillInAccounts(config.overrides?.[network]);
  delete config.overrides;

  if (overrides) {
    return fillInAccounts({ ...config, ...overrides });
  }

  return fillInAccounts(config);
}

function fillInAccounts(config: AppConfig): AppConfig {
  if (!config?.account) {
    return config;
  }

  return {
    ...config,
    accounts: {
      deploy: config.accounts?.deploy || config.account,
      signer: config.accounts?.signer || config.account,
      dev: config.accounts?.dev || config.account,
    },
  };
}

export async function loadConfig(src: string, network?: Network) {
  return await readConfig(path.join(src, "bos.config.json"), network);
}

