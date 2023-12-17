import { Options as SucraseOptions, transform as transformTs } from "sucrase";

import { AccountID, Aliases, Code, ConfigComment, IPFSMap, Log, Modules } from "./types";
import { BaseConfig } from "@/lib/config";

interface Output {
  code: Code,
  logs: Array<Log>,
};

export interface TranspileJSOptions {
  compileTypeScript?: boolean;
  format?: boolean;
};

export async function transpileTypescript(code: Code, tsConfig?: any): Promise<Output> {
  let transpiledCode = code, logs: Log[] = [];

  const sucraseOptions: SucraseOptions = {
    transforms: ["typescript", "jsx"],
    jsxRuntime: "preserve",
    enableLegacyBabel5ModuleInterop: true, // Preserve CommonJS import/export statements
    disableESTransforms: true,
    ...(tsConfig && tsConfig.compilerOptions),
  };

  try {
    transpiledCode = transformTs(code, sucraseOptions).code;
  } catch (e: any) {
    logs.push({
      message: e.message || "Something went wrong while transpiling TypeScript",
      level: "error",
    });
  }

  // if no default export is found, add error
  if (!transpiledCode.match(/export\s+default\s/g)) {
    logs.push({
      message: "No default export found",
      level: "warn",
    });
  }

  // replace the "export default x;" with "return x(props);"
  transpiledCode = transpiledCode.replace(
    /export\s+default\s+(\w+);/,
    "return $1(props);",
  );

  // replace the "export default *" with "return *"
  transpiledCode = transpiledCode.replace(
    /export\s+default\s+/,
    "return ",
  );

  return {
    code: transpiledCode,
    logs: logs,
  }
}

export async function replaceImportsConfig(code: Code, config: BaseConfig): Promise<Output> {
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
  config: BaseConfig,
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

export async function format(code: Code): Promise<Output> {
  return {
    code: code,
    logs: [],
  }
};

export async function transpileJS(code: Code, importParams: ReplaceImportsParams, opts?: TranspileJSOptions): Promise<Output> {
  let output_code = code;
  let logs: Array<Log> = [];
  const ecc_res = await extractConfigComments(code);
  logs = logs.concat(ecc_res.logs);
  output_code = ecc_res.code;
  const config_comments = ecc_res.configs;

  if (opts?.compileTypeScript) {
    const tt_res = await transpileTypescript(output_code);
    output_code = tt_res.code;
    logs = logs.concat(tt_res.logs);
  }

  if (config_comments.find(c => c.name === 'skip')) {
    logs.push({
      message: 'Skipping compilation because of @skip comment',
      level: 'info',
      source: {
        line: config_comments.find(c => c.name === 'skip')?.line,
      }
    });
    return {
      code: output_code,
      logs: logs,
    };
  }

  const ri_res = await replaceImports(output_code, importParams);
  output_code = ri_res.code;
  logs = logs.concat(ri_res.logs);

  if (opts?.format ?? true) {
    const f_res = await format(output_code);
    output_code = f_res.code;
    logs = logs.concat(f_res.logs);
  }

  return {
    code: output_code,
    logs: logs,
  };
}
