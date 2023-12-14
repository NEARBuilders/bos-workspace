import {
  transpileTypescript,
  replaceImportsModule,
  replaceImportsConfig,
  replaceImportsAlias,
  replaceImportsIPFS,
  extractConfigComments,
  replaceImports
} from "@/lib/parser";

describe('transpileTypescript', () => {
  it('should transpile TypeScript code to JavaScript', async () => {
    const tsCode = `let x: number = 10;`;
    const expectedJsCode = `let x = 10;`;
    const result = await transpileTypescript(tsCode);
    expect(result).toEqual(expectedJsCode);
  });
});


describe('replaceImportsConfig', () => {
  it('should replace configurations in code based on provided config object', async () => {
    const code = "let account = \"@{config/account}\";console.log(`@{config/accounts.deploy}`);console.log('hello @{config/accounts.signer}');console.log('@{config/accounts.dev} quit');";
    const cases: any = [{
      input: {
        code: code,
        config: {
          account: "jest.near",
        }
      },
      output: {
        code: "let account = \"jest.near\";console.log(`jest.near`);console.log('hello jest.near');console.log('jest.near quit');",
        logs: [],
      }
    },
    {
      input: {
        code: code,
        config: {
          accounts: {
            "deploy": "deploy.near",
            "signer": "signer.near",
            "dev": "dev.near",
          }
        }
      },
      output: {
        code: "let account = \"deploy.near\";console.log(`deploy.near`);console.log('hello signer.near');console.log('dev.near quit');",
        logs: [],
      }
    },
    {
      input: {
        code: code,
        config: {
          accounts: {
            dev: "dev.near",
          }
        },
      },
      output: {
        code,
        logs: [
          {
            message: "Imported config not found: config/account",
            level: "warn",
            source: {
              line: 0,
            },
          },
          {
            message: "Imported config not found: config/accounts.deploy",
            level: "warn",
            source: {
              line: 0,
            }
          },
          {
            message: "Imported config not found: config/accounts.signer",
            level: "warn",
            source: {
              line: 0,
            }
          },
        ],
      }
    }
    ];
    for (const c of cases) {
      const result = await replaceImportsConfig(c.input.code, c.input.config);
      expect(result).toEqual(c.output);
    }
  });
  it('should throw if the imported config is not found', async () => {

  });
});

describe('replaceImportsModule', () => {
  it('should correctly replace module imports in code', async () => {
    const code = "let module = \"@{module/db}\";VM.require(`@{module/folder.file}`);";
    const cases = [
      {
        input: {
          code,
          modules: ["module/db", "module/folder/file"],
          account: "jest.near",
        },
        output: {
          code: "let module = \"jest.near/widget/db.module\";VM.require(`jest.near/widget/folder.file.module`);",
          logs: [],
        }
      },
      {
        input: {
          code,
          modules: ["module/db"],
          account: "jest.near",
        },
        output: {
          code: "let module = \"jest.near/widget/db.module\";VM.require(`jest.near/widget/folder.file.module`);",
          logs: [
            {
              message: "Imported module not found locally: module/folder.file",
              level: "warn",
              source: {
                line: 0,
              }
            }
          ]
        }
      }
    ];
    for (const c of cases) {
      const result = await replaceImportsModule(c.input.code, c.input.modules, c.input.account);
      expect(result).toEqual(c.output);
    }
  });
});


describe('replaceImportsIPFS', () => {
  it('should replace IPFS links in code as per the IPFS map', async () => {
    const code = "let ipfs = `@{ipfs/abc}`;return <div><img src=\"@{ipfs/def}\" /></div>";
    const cases: any = [
      {
        input: {
          code,
          ipfsMap: {
            "abc": "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
            "def": "bafkreicgnsizdxoc436tbln3ucqo45hdauumd7if4gltrqh3tbxgosi3q4",
          },
          ipfsGateway: "https://ipfs.near.social/",
        },
        output: {
          code: "let ipfs = `https://ipfs.near.social/bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam`;return <div><img src=\"https://ipfs.near.social/bafkreicgnsizdxoc436tbln3ucqo45hdauumd7if4gltrqh3tbxgosi3q4\" /></div>",
          logs: [],
        }
      },
      {
        input: {
          code,
          ipfsMap: {
            "abc": "bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam",
          },
          ipfsGateway: "https://ipfs.near.social/",
        },
        output: {
          code: "let ipfs = `https://ipfs.near.social/bafkreicpbijnii55242f7wcs6xnjf3ocyuyuguts6r6kkfz745g3jjudam`;return <div><img src=\"@{ipfs/def}\" /></div>",
          logs: [
            {
              message: "Imported IPFS link not found: ipfs/def",
              level: "warn",
              source: {
                line: 0,
              }
            }
          ]
        }
      }
    ];
    for (const c of cases) {
      const result = await replaceImportsIPFS(c.input.code, c.input.ipfsMap, c.input.ipfsGateway);
      expect(result).toEqual(c.output);
    }
  });
});

describe('replaceImportsAlias', () => {
  it('should replace alias imports in code according to aliases object', async () => {
    const code = "let alias = `@{alias/abc}`;console.log(`@{alias/def}`);";
    const cases: any = [
      {
        input: {
          code,
          aliases: {
            "abc": "def",
            "def": "ghi",
          }
        },
        output: { code: "let alias = `def`;console.log(`ghi`);", logs: [] }
      },
      {
        input: {
          code,
          aliases: {
            "def": "ghi",
          }
        },
        output: {
          code: "let alias = `@{alias/abc}`;console.log(`ghi`);",
          logs: [
            {
              message: "Imported alias not found: alias/abc",
              level: "warn",
              source: {
                line: 0,
              }
            }
          ]
        }
      }
    ];
    for (const c of cases) {
      const result = await replaceImportsAlias(c.input.code, c.input.aliases);
      expect(result).toEqual(c.output);
    }
  });
});

describe('replaceImports', () => {
  it('should return code with replaced imports', async () => {
    const code = `
      let config = "@{config/account}";
      let module = "@{module/db}";
      let alias = "@{alias/util}";
      let ipfs = "@{ipfs/xyz}";
    `;

    const config = { account: "user.near" };
    const modules = ["module/db"];
    const aliases = { "util": "utility" };
    const ipfsMap = { "xyz": "bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3" };
    const ipfsGateway = "https://ipfs.org/";

    const expectedOutput = {
      code: `
      let config = "user.near";
      let module = "@{user.near/widget/db.module}";
      let alias = "utility";
      let ipfs = "https://ipfs.org/bafkreihdwdcef3tkddpljak234nlasjd93j4asdhfas3";
    `,
      logs: []
    };

    const result = await replaceImports(code, { config, modules, aliases, ipfsMap, ipfsGateway });
    expect(result).toEqual(expectedOutput);
  });
  it('should return logs for missing imports', async () => {
    const code = `
      let config = "@{config/account}";
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
      let config = "@{config/account}";
      let module = "/widget/db.module";
      let alias = "@{alias/util}";
      let ipfs = "@{ipfs/xyz}";
    `,
      logs: []
    };

    const result = await replaceImports(code, { config, modules, aliases, ipfsMap, ipfsGateway });
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
            line: 0,
          }
        ]
      },
      {
        input: "/*  @skip */",
        output: [
          {
            name: "skip",
            value: undefined,
            line: 0,
          }
        ]
      },
      {
        input: "//  @skip('reason')",
        output: [
          {
            name: "skip",
            value: "'reason'",
            line: 0,
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
            line: 2,
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

