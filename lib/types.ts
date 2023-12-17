export type Code = string;
export type Network = 'testnet' | 'mainnet';
export type AccountID = string;

export type Modules = Array<string>;

export type IPFSMap = Record<string, string>;

export type Aliases = Record<string, string>;

export interface ConfigComment {
  name: 'skip';
  value?: string;
  begin: number;
  end: number;
};

export interface Log {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source?: {
    line?: number;
    file?: string;
  }
};

