import { spawn } from 'child_process';
import path from "path";
import fs from "fs";

import { buildApp } from "@/lib/build";
import { readConfig } from "@/lib/config";
import { Network } from "@/lib/types";
import { move, pathExists, readdir, remove } from "@/lib/utils/fs";
import { readWorkspace } from "@/lib/workspace";

const DEPLOY_DIST_FOLDER = "build";

export type DeployOptions = {
    deployAccountId?: string;
    signerAccountId?: string;
    signerPublicKey?: string;
    signerPrivateKey?: string;
    network?: Network;
};

// translate files from src/widget to src
export async function translateForBosCli(dist: string) {
    const srcDir = path.join(dist, "src", "widget");
    const targetDir = path.join(dist, "src");

    const new_files = await readdir(srcDir).catch(() => ([]));
    const original_files = await readdir(targetDir).catch(() => ([]));

    for (const file of new_files) {
        await move(path.join(srcDir, file), path.join(targetDir, file), { overwrite: true });
    }

    for (const file of original_files) {
        if (new_files.includes(file))
            continue;

        await remove(path.join(targetDir, file));
    }
}

// deploy the app widgets and modules
export async function deployAppCode(src: string, dist: string, opts: DeployOptions) {
    const fullSrc = path.resolve(src);
    const fullDist = path.resolve(dist);

    const deploying = log.loading(`[${fullSrc}] Deploying app`, LogLevels.BUILD);
		
		// Build
    await buildApp(src, dist, opts.network);

    // Translate for bos cli
    await log.wait(
        translateForBosCli(dist),
        `[${fullDist}] Translating files for bos cli`,
        `[${fullDist}] Translated successfully`,
        `[${fullDist}] Failed to translate`,
        LogLevels.BUILD
    );

    // Exec bos-cli;
    const config = await readConfig(path.join(src, "bos.config.json"), opts.network);

    const BOS_DEPLOY_ACCOUNT_ID = config.accounts.deploy || opts.deployAccountId || config.account;
    const BOS_SIGNER_ACCOUNT_ID = config.accounts.signer || opts.signerAccountId || config.account;
    const BOS_SIGNER_PUBLIC_KEY = opts.signerPublicKey;
    const BOS_SIGNER_PRIVATE_KEY = opts.signerPrivateKey;

    if (!BOS_DEPLOY_ACCOUNT_ID) {
        deploying.error(`Necessary values not provided, please provide Account ID for deploy`);
        return;
    } else if (!BOS_SIGNER_ACCOUNT_ID) {
        deploying.error(`Necessary values not provided, please provide Signer Account ID for deploy`);
        return;
    }

    // Prepare the command and arguments
    const args = [
        'bos-cli', 'components', 'deploy', `${BOS_DEPLOY_ACCOUNT_ID}`,
        'sign-as', `${BOS_SIGNER_ACCOUNT_ID}`,
        'network-config', `${opts.network}`
    ];

    if (BOS_SIGNER_PUBLIC_KEY && BOS_SIGNER_PRIVATE_KEY) {
        args.push(
            'sign-with-plaintext-private-key',
            '--signer-public-key', `${BOS_SIGNER_PUBLIC_KEY}`,
            '--signer-private-key', `${BOS_SIGNER_PRIVATE_KEY}`,
            'send'
        );
    }

    const deployProcess = spawn('npx', args, {
        cwd: dist,
        stdio: 'inherit' // This allows the process to inherit the parent process's stdio streams
    });

    deployProcess.on('close', (code) => {
        if (code === 0) {
            deploying.finish(`[${fullSrc}] App deployed successfully`);
        } else {
            deploying.error(`Deployment failed with code ${code}`);
        }
    });

    deployProcess.on('error', (err) => {
        deploying.error(`Deployment failed with error: ${err.message}`);
    });
}

export async function deployAppData(src: string, account: string, opts: DeployOptions) {
  if (!account) {
    console.log(`App account is not defined for ${src}. Skipping data upload`);
    return;
  }

  const dataJSON = fs.readFileSync(
    path.join(src, DEPLOY_DIST_FOLDER, "data.json"),
    "utf8"
  );

  const args = { data: JSON.parse(dataJSON) };
  const argsBase64 = Buffer.from(JSON.stringify(args)).toString("base64");
  
  const BOS_SIGNER_PUBLIC_KEY = opts?.signerPublicKey;
  const BOS_SIGNER_PRIVATE_KEY = opts?.signerPrivateKey;

	const automaticSignIn = [
		"sign-with-plaintext-private-key",
		"--signer-public-key", 
		BOS_SIGNER_PUBLIC_KEY,
		"--signer-private-key",
		BOS_SIGNER_PRIVATE_KEY,
		"send"
	]

  let command = [
    "near-cli-rs",
    "contract",
    "call-function",
    "as-transaction",
    "social.near",
    "set",
    "base64-args",
    `${argsBase64}`,
    "prepaid-gas",
    "300 TeraGas",
    "attached-deposit",
    "0.15 NEAR", // deposit
    "sign-as",
    account,
    "network-config",
    "mainnet",
  ];

	if (BOS_SIGNER_PUBLIC_KEY && BOS_SIGNER_PRIVATE_KEY) command = command.concat(automaticSignIn)

  const deployProcess = spawn("npx", command, {
    cwd: path.join(src, DEPLOY_DIST_FOLDER),
    stdio: "inherit",
  });

  deployProcess.on("close", (code) => {
    if (code === 0) {
      console.log(`Uploaded data for ${src}`);
    } else {
      console.error(`Data upload failed with code ${code}`);
    }
  });

  deployProcess.on("error", (err) => {
    console.error(`Error uploading data for ${src}:\n${err.message}`);
  });
}

export async function deploy(appName: string, opts: DeployOptions) {
  const src = ".";

  // Deploy single project
  if (!appName) {
    if (await pathExists(path.join(src, "bos.config.json"))) {
      // Check if the directory has bos.config.json file
      await deployAppCode(src, path.join(src, DEPLOY_DIST_FOLDER), opts);
      return;
    } else {
      // Check if the directory has bos.workspace.json file
      if (await pathExists(path.join(src, "bos.workspace.json"))) {
        log.error(`Please provide app name`);
        return;
      }
    }

    log.error(`[${src}] bos.config.json file is not existing in the project`);
    return;
  }

  // Deploy workspace app
  const { apps } = await readWorkspace(src);

  const findingApp = log.loading(
    `Finding ${appName} in the workspace`,
    LogLevels.BUILD
  );
  const appSrc = apps.find((app) => app.includes(appName));
  if (!appSrc) {
    findingApp.error(`Not found ${appName} in the workspace`);
    return;
  }
  findingApp.finish(`Found ${appName} in the workspace`);

  await deployAppCode(appSrc, path.join(DEPLOY_DIST_FOLDER, appSrc), opts);
}
