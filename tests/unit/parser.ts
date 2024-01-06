import {
  transpileTypescript,
  evalModule,
  evalConfig,
  evalAlias,
  evalIPFS,
  evalCustomSyntax,
  extractConfigComments,
  format,
  transpileJS,
} from "@/lib/parser";

describe('transpileTypescript', () => {
  it('should transpile TypeScript widget to JavaScript', async () => {
    const tsCode = `let x: number = 10; function b(){ return "hello"; } export default b;`;
    const expected = { code: `let x = 10; function b(){ return "hello"; } return b(props);`, logs: [] };
    const result = await transpileTypescript(tsCode);
    expect(result).toEqual(expected);
  });
  it('should transpile TypeScript module to JavaScript', async () => {
    const tsCode = `let x: number = 10; function b(){ return "hello"; } export default { b };`;
    const expected = { code: `let x = 10; function b(){ return "hello"; } return { b };`, logs: [] };
    const result = await transpileTypescript(tsCode);
    expect(result).toEqual(expected);
  });
  it('should return an error if no default export is found', async () => {
    const tsCode = `let x: number = 10; function b(){ return "hello"; } export { b };`;
    const expected = {
      code: `let x = 10; function b(){ return "hello"; } export { b };`, logs: [
        {
          message: "No default export found",
          level: "warn",
        }
      ]
    };
    const result = await transpileTypescript(tsCode);
    expect(result).toEqual(expected);
  });
});


describe('evalConfig', () => {
  it('should replace configurations in code based on provided config object', async () => {
    const input = [
      ["account"],
      ["accounts", "deploy"],
      ["accounts", "signer"],
      ["accounts", "dev"],
    ];
    const output = [
      "jest.near",
      "jest.near",
      "signer.near",
      "dev.near",
    ];
    for (let i = 0; i < input.length; i++) {
      const result = evalConfig(input[i], {
        accounts: {
          deploy: "jest.near",
          signer: "signer.near",
          dev: "dev.near",
        }
      });
      expect(result.code).toEqual(output[i]);
    }
  });
  it('should return logs for missing configs', () => {
    const result = evalConfig(["accounts", "deploy"], {});
    expect(result.logs).toEqual([
      {
        message: "Config value not found: @{config/accounts/deploy}",
        level: "warn",
      }
    ])
  })
});

describe('evalModule', () => {
  it('should correctly replace module imports in code', async () => {
    const inputs = [
      "db".split('/'),
      "folder/file".split('/'),
      "folder/file/another".split('/'),
    ];
    const outputs = [
      "jest.near/widget/db.module",
      "jest.near/widget/folder.file.module",
      "jest.near/widget/folder.file.another.module",
    ];
    for (let i = 0; i < inputs.length; i++) {
      const result = evalModule(inputs[i], ["db"], "jest.near");
      expect(result.code).toEqual(outputs[i]);
    }
  });
  it('should return logs for missing modules, but still replace them', async () => {
    const input = "folder/file".split('/');
    const output = {
      code: "jest.near/widget/folder.file.module",
      logs: [
        {
          message: "Imported module not found locally: @{module/folder/file}",
          level: "warn",
        }
      ]
    };
    const result = evalModule(input, ["db"], "jest.near");
    expect(result).toEqual(output);
  })
});


describe('evalIPFS', () => {
  it('should replace IPFS links in code as per the IPFS map', async () => {
    const inputs = [
      "abc.svg".split('/'),
      "def/bcd.png".split('/'),
      "ghi/xyz/abc.jpg".split('/'),
    ];
    const outputs = [
      "https://ipfs.near.social/ipfs/cid1",
      "https://ipfs.near.social/ipfs/cid2",
      "https://ipfs.near.social/ipfs/cid3",
    ];
    for (let i = 0; i < inputs.length; i++) {
      const result = evalIPFS(inputs[i], {
        "abc.svg": "cid1",
        "def/bcd.png": "cid2",
        "ghi/xyz/abc.jpg": "cid3",
      }, "https://ipfs.near.social/ipfs");
      expect(result.code).toEqual(outputs[i]);
    }
  });
  it('should return logs for missing IPFS links', async () => {
    const input = "abc.svg".split('/');
    const output = {
      code: "@{ipfs/abc.svg}",
      logs: [
        {
          message: "IPFS file or mapping not found: @{ipfs/abc.svg}",
          level: "warn",
        }
      ]
    };
    const result = evalIPFS(input, {}, "https://ipfs.near.social/ipfs");
    expect(result).toEqual(output);
  })
});

describe('evalAlias', () => {
  it('should replace alias imports in code according to aliases object', async () => {
    const inputs = [
      "util".split('/'),
      "util/abc/h".split('/'),
      "Util.abc@xyz".split('/'),
    ];
    const outputs = [
      "val1",
      "val2",
      "val3",
    ];
    for (let i = 0; i < inputs.length; i++) {
      const result = evalAlias(inputs[i], {
        "util": "val1",
        "util/abc/h": "val2",
        "Util.abc@xyz": "val3",
      });
      expect(result.code).toEqual(outputs[i]);
    }
  });
  it('should return logs for missing aliases', async () => {
    const input = "util".split('/');
    const output = {
      code: "@{alias/util}",
      logs: [
        {
          message: "Imported alias not found: @{alias/util}",
          level: "warn",
        }
      ]
    };
    const result = evalAlias(input, {});
    expect(result).toEqual(output);
  })
});

describe('evalCustomSyntax', () => {
  it('should return code with replaced imports', async () => {
    const code = `
      let config = "@{config/account}";
      let module = "@{module/db}";
      let alias = "@{alias/util}";
      let ipfs = "@{ipfs/xyz}";
      let other = "@{other/abc}";
      let other1 = "@{REPL_HELLO}";
    `;

    const config = { accounts: { deploy: "user.near" } };
    const modules = ["db"];
    const aliases = { "util": "utility", "other/abc": "other", "REPL_HELLO": "hello" };
    const ipfsMap = { "xyz": "bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3" };
    const ipfsGateway = "https://ipfs.org/";

    const expectedOutput = {
      code: `
      let config = "user.near";
      let module = "user.near/widget/db.module";
      let alias = "utility";
      let ipfs = "https://ipfs.org/bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3";
      let other = "other";
      let other1 = "hello";
    `,
      logs: []
    };

    const result = evalCustomSyntax(code, { config, modules, aliases, ipfsMap, ipfsGateway });
    expect(result).toEqual(expectedOutput);
  });
  it('should return logs for missing imports', async () => {
    const code = `
      let config = "@{config/account/deploy}";
      let module = "@{module/db}";
      let alias = "@{alias/util}";
      let ipfs = "@{ipfs/xyz}";
    `;

    const config = {};
    const modules: any = [];
    const aliases = {};
    const ipfsMap = {};
    const ipfsGateway = "https://ipfs.org/";

    const expectedOutput = {
      code: `
      let config = "@{config/accounts/deploy}";
      let module = "/widget/db.module";
      let alias = "@{alias/util}";
      let ipfs = "@{ipfs/xyz}";
    `,
      logs: [
        {
          message: "Config value not found: @{config/accounts/deploy}",
          level: "warn",
        },
        {
          message: "Imported module not found locally: @{module/db}",
          level: "warn",
        },
        {
          message: "Imported alias not found: @{alias/util}",
          level: "warn",
        },
        {
          message: "IPFS file or mapping not found: @{ipfs/xyz}",
          level: "warn",
        },
      ]
    };

    const result = evalCustomSyntax(code, { config, modules, aliases, ipfsMap, ipfsGateway });
    expect(result).toEqual(expectedOutput);
  })
});


describe('extractConfigComments', () => {
  it('should extract configuration comments from the code', async () => {
    const cases = [
      {
        input: "// @skip",
        output: [
          {
            name: "skip",
            value: undefined,
            begin: 1,
            end: 1,
          }
        ]
      },
      {
        input: "/*  @skip */",
        output: [
          {
            name: "skip",
            value: undefined,
            begin: 1,
            end: 1,
          }
        ]
      },
      {
        input: "//  @skip('reason')",
        output: [
          {
            name: "skip",
            value: "'reason'",
            begin: 1,
            end: 1,
          }
        ]
      },
      {
        input: `

        // @skip('reason')
        `,
        output: [
          {
            name: "skip",
            value: "'reason'",
            begin: 3,
            end: 3,
          }
        ]
      }
    ];
    for (const c of cases) {
      const result = await extractConfigComments(c.input);
      expect(result.configs).toEqual(c.output);
    }
  });
});

describe('format', () => {
  it('should format the code without affecting its functionality', async () => {
    const code = `VM.require("hello/near");return<div>{"bye"}</div>;`;
    const result = await format(code);
    expect(result.code.replace(/\s/g, '')).toEqual(code);
  })
});


describe('transpileJS', () => {
  it('should compile typescript, respect the config comments, and replace imports', async () => {
    const cases = [
      {
        input: {
          code: `
            let account = "@{config/account}";
            let module = "@{module/db}";
            let alias = "@{alias/util}";
            let ipfs = "@{ipfs/xyz}";
            type MyType = {
              hello: string;
            }

            export default <div></div>;
          `,
          importParams: {
            config: {
              accounts: {
                deploy: "jest.near",
              }
            },
            modules: ["db"],
            aliases: { "util": "utility" },
            ipfsMap: { "xyz": "bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3" },
            ipfsGateway: "https://ipfs.org/",
          },
          opts: {
            compileTypeScript: true,
            format: true,
          }
        },
        output: {
          code: `let account = "jest.near";
let module = "jest.near/widget/db.module";
let alias = "utility";
let ipfs = "https://ipfs.org/bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3";

return <div></div>;
`,
          logs: []
        }
      }
    ];

    for (const c of cases) {
      const result = await transpileJS(c.input.code, c.input.importParams, c.input.opts);
      expect(result).toEqual(c.output);
    }
  })
  it("should skip transpilation if there is @skip comment", async () => {
    const input = {
      code: `
      // @skip
      let account = "@{config/account}";
      let module = "@{module/db}";  
      return <div></div>;
  `,
      importParams: {
        config: {
          accounts: {
            deploy: "jest.near",
          }
        },
        modules: ["db"],
        aliases: { "util": "utility" },
        ipfsMap: { "xyz": "bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3" },
        ipfsGateway: "https://ipfs.org/",
      },
      opts: {
        compileTypeScript: false,
        format: true,
      }
    };
    const output = {
      code: `      let account = "@{config/account}";
      let module = "@{module/db}";
      return <div></div>;
`,
      logs: [
        {
          message: "Skipping compilation because of @skip comment",
          level: "info",
          source: {
            line: 2,
          }
        }
      ]
    }
    const result = await transpileJS(input.code, input.importParams, input.opts);
    expect(result.code.replace(/\s/g, '')).toEqual(output.code.replace(/\s/g, ''));
    expect(result.logs).toEqual(output.logs);
  })
});
