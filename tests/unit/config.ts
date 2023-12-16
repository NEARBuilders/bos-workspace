import { readConfig, DEFAULT_CONFIG } from '@/lib/config';


describe('readConfig', () => {
  it("should return the default configuration if no parameters provided", async () => {
    const config = await readConfig({});
    expect(config).toEqual({
      ...DEFAULT_CONFIG,
      accounts: {
        deploy: DEFAULT_CONFIG.account,
        signer: DEFAULT_CONFIG.account,
        dev: DEFAULT_CONFIG.account,
      },
    });
  });

  it('should return the config', async () => {
    const config = await readConfig({
      account: "account.near",
      accounts: {
        signer: "signer.near"
      },
      format: true,
    })
    expect(config).toEqual({
      ...DEFAULT_CONFIG,
      account: "account.near",
      accounts: {
        deploy: "account.near",
        signer: "signer.near",
        dev: "account.near"
      },
      format: true,
    })
  })

  it('should return the config with overrides', async () => {
    const config = await readConfig({
      accounts: {
        deploy: "deploy.near",
        signer: "signer.near",
        dev: "dev.near"
      },
      format: true,
      overrides: {
        testnet: {
          account: "testing.testnet",
          accounts: {
            signer: "signer.testnet",
          },
          format: false,
          ipfs: {
            gateway: "http://testnetgateway/ipfs"
          }
        }
      }
    }, "testnet");
    expect(config).toEqual({
      ...DEFAULT_CONFIG,
      account: "testing.testnet",
      accounts: {
        deploy: "testing.testnet",
        signer: "signer.testnet",
        dev: "testing.testnet",
      },
      format: false,
      ipfs: {
        gateway: "http://testnetgateway/ipfs",
        uploadApi: DEFAULT_CONFIG.ipfs.uploadApi,
        uploadApiHeaders: DEFAULT_CONFIG.ipfs.uploadApiHeaders,
      }
    })
  });

  it('it should remove unknown values without throwing', async () => {
    const config = await readConfig({
      hello: {
      },
      accounts: {
        something: "something"
      }
    });

    expect(config).toEqual({
      ...DEFAULT_CONFIG,
      accounts: {
        deploy: DEFAULT_CONFIG.account,
        signer: DEFAULT_CONFIG.account,
        dev: DEFAULT_CONFIG.account,
      }
    })
  })

  it('should throw if a known config is invalid', async () => {
    const config = readConfig({
      account: {},
      accounts: {
        dev: 123,
      }
    });
    expect(config).rejects.toThrow();
  })
});



