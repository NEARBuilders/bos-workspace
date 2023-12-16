import Joi from 'joi';
import { readJson } from '@/lib/utils/fs';

interface AccountConfig {
  deploy?: string;
  signer?: string;
  dev?: string;
}

interface BaseConfig {
  account?: string;
  accounts?: AccountConfig;
  ipfs: {
    gateway: string | null;
    uploadApi: string | null;
    uploadApiHeaders: Record<string, string>;
  };
  format: boolean;
}

interface NetworkConfig {
  mainnet?: BaseConfig;
  testnet?: BaseConfig;
}

interface AppConfig extends BaseConfig {
  overrides?: NetworkConfig;
}

export const DEFAULT_CONFIG = {
  account: "bosworkspace",
  format: true,
  ipfs: {
    gateway: "https://ipfs.near.social/ipfs",
    uploadApi: "https://ipfs.near.social/add",
    uploadApiHeaders: {},
  }
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
    return { ...config, ...overrides };
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

