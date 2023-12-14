import { AccountID, Aliases, Code, ConfigComment, IPFSMap, Log, Modules, SimpleConfig } from "./types";

interface Output {
  code: Code,
  logs: Array<Log>,
};

export async function transpileTypescript(code: Code, tsConfig?: any): Promise<Output> {
  return {
    code: code,
    logs: [],
  };
}

export async function replaceImportsConfig(code: Code, config: SimpleConfig): Promise<Output> {
  return {
    code: code,
    logs: [],
  };
};

export async function replaceImportsModule(code: Code, modules: Modules, account: AccountID): Promise<Output> {
  return { code: code, logs: [] };
}

export async function replaceImportsIPFS(code: Code, ipfsMap: IPFSMap, ipfsGateway: string): Promise<Output> {
  return { code: code, logs: [] };
};

export async function replaceImportsAlias(code: Code, aliases: Aliases): Promise<Output> {
  return { code: code, logs: [] };
};

interface ReplaceImportsParams {
  config: SimpleConfig,
  modules: Modules,
  ipfsMap: IPFSMap,
  ipfsGateway: string,
  aliases: Aliases,
};

export async function replaceImports(code: Code, params: ReplaceImportsParams): Promise<Output> {
  return { code: code, logs: [] };
}

export async function extractConfigComments(code: Code): Promise<Output & { configs: ConfigComment[] }> {
  const codeWithoutConfigComments = code;
  return {
    code: codeWithoutConfigComments,
    configs: [],
    logs: [],
  };
}

