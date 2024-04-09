import { BaseConfig } from "./config";
const { read_bos_config } = require("./config");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { uploadToIpfs } = require("./ipfs");

const distFolder = process.env.DIST_FOLDER || "build";

// deploy the app widgets and modules
export async function deployAppCode(src: string, config: BaseConfig) {
}

// publish data.json to SocialDB
export async function deployAppData(src: string, config: BaseConfig) {
}

// deploy manifest / types to attestation registry
export async function deploy_with_metadata(appFolder, typeFile) {
  const config = read_bos_config(appFolder);
  const { appAccount, version } = config;

  console.log("Uploading package metadata with config:", config);
  if (!appAccount) {
    console.error(
      `App account is not defined for ${appFolder}. Skipping data upload.`,
    );
    return;
  }

  const dataJSON = fs.readFileSync(
    path.join(distFolder, appFolder, "data.json"),
    "utf8",
  );

  let typeDefinition = {};

  if (typeFile) {
      typeDefinition = fs.readFileSync(
        path.join(distFolder, appFolder, typeFile),
        "utf8",
      );
  }

  let content = {
    data: {
      [appAccount]: JSON.parse(dataJSON),
      metadata: {},
      types: JSON.parse(typeFile)
    },
  };

  try {
    const metadataJSON = fs.readFileSync(
      path.join(distFolder, appFolder, "metadata.json"),
      "utf8",
    );
    content.metadata = JSON.parse(metadataJSON);
  } catch (error) {
    console.log(error.message);
    console.log(`Skipping metadata pinning...`);
  }

  const formattedContent = [content];
  const ipfsHash = await uploadToIpfs(formattedContent);
  try {
    console.log(`Uploaded data for ${appFolder} with ipfs hash: ${ipfsHash}`);
  } catch (error) {
    console.log(
      `Error uploading data for ${appFolder} with ipfs hash: ${ipfsHash}`,
    );
    console.error(`Error uploading data for ${appFolder}:\n${error.message}`);
  }

  const manifest = {
    package_name: `${appFolder}`,
    version: `${version ?? ""}`,
    content_type: "ipfs",
    cid: ipfsHash.toString(),
    is_contract: true,
  };

  const argsBase64 = Buffer.from(JSON.stringify(manifest)).toString("base64");
  const packageRoot = path.resolve(__dirname, "..");
  const nearBinaryPath = path.join(packageRoot, "node_modules", ".bin", "near");
  const REGISTRY_ADDRESS = "efficacious-mother.testnet";

  // TODO: dynamically adjust based on NEAR CLI accounts / signin status / preferences. If signed in, metdata uploads will work, but will throw an error before the contract is called.
  const USE_DEFAULT_SIGNER_OPTIONS = true;
  const getSignerOptions = () =>
    USE_DEFAULT_SIGNER_OPTIONS
      ? ["sign-as", appAccount, "network-config", "testnet"]
      : [];

  const command = [
    nearBinaryPath,
    "contract",
    "call-function",
    "as-transaction",
    REGISTRY_ADDRESS,
    "create_manifest",
    "base64-args",
    `'${argsBase64}'`,
    "prepaid-gas",
    "'300.000 TeraGas'",
    ...getSignerOptions(),
  ].join(" ");

  try {
    execSync(command, {
      cwd: path.join(distFolder, appFolder),
      stdio: "inherit",
    });
    console.log(`Uploaded data for ${appFolder}`);
  } catch (error) {
    console.error(`Error uploading data for ${appFolder}:\n${error.message}`);
  }
}
