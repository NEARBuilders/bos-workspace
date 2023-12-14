export type Code = string;
export type Network = 'testnet' | 'mainnet';
export type AccountID = string;

export interface SimpleConfig {
  account?: AccountID;
  accounts?: Record<'deploy' | 'signer' | 'dev', AccountID>;
};

export interface ConfigByNetwork {
  network?: Network;
  testnet?: SimpleConfig;
  mainnet?: SimpleConfig;
};

export type Config = SimpleConfig | ConfigByNetwork;

export type Modules = Array<string>;

export type IPFSMap = Record<string, string>;

export type Aliases = Record<string, string>;

export interface ConfigComment {
  name: 'skip';
  value?: string;
  line: number;
};

export interface Log {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source?: {
    line?: number;
    file?: string;
  }
};
