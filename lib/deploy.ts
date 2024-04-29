import path from "path";
import { exec, ExecException } from "child_process";

import { BaseConfig, readConfig } from "@/lib/config";
import { buildApp } from "@/lib/build";
import { readWorkspace } from "@/lib/workspace";
import { Log, Network } from "@/lib/types";
import { readdir, remove, move, pathExists } from "@/lib/utils/fs";
import { Logger } from "./logger";

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

    // Read config
    const config = await readConfig(path.join(src, "bos.config.json"), opts.network);
    
    const BOS_DEPLOY_ACCOUNT_ID = config.accounts.deploy || opts.deployAccountId;
    const BOS_SIGNER_ACCOUNT_ID = config.accounts.signer || opts.signerAccountId;
    const BOS_SIGNER_PUBLIC_KEY = opts.signerPublicKey;
    const BOS_SIGNER_PRIVATE_KEY = opts.signerPrivateKey;

    if (!BOS_DEPLOY_ACCOUNT_ID) {
        deploying.error(`Necessary values not provided, please provide Account ID for deploy`);
        return;
    } else if (!BOS_SIGNER_ACCOUNT_ID) {
        deploying.error(`Necessary values not provided, please provide Signer Account ID for deploy`);
        return;
    } else if (!BOS_SIGNER_PUBLIC_KEY || !BOS_SIGNER_PRIVATE_KEY) {
        deploying.error(`Necessary values not provided, please provide private & public key for deploy`);
        return;
    }
    
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
    exec(
        `cd ${dist} && npx bos components deploy "${BOS_DEPLOY_ACCOUNT_ID}" sign-as "${BOS_SIGNER_ACCOUNT_ID}" network-config "${opts.network}" sign-with-plaintext-private-key --signer-public-key "${BOS_SIGNER_PUBLIC_KEY}" --signer-private-key "${BOS_SIGNER_PRIVATE_KEY}" send`,
        (error: ExecException | null, stdout: string, stderr: string) => {
            if (!error) {
                deploying.finish(`[${fullSrc}] App deployed successfully`);
                return;
            }

            deploying.error(error.message);
        }
    );
}

// publish data.json to SocialDB
export async function deployAppData(src: string, config: BaseConfig) {
}

export async function deploy(appName: string, opts: DeployOptions) {
    const src = '.';

    // Deploy single project
    if (!appName) {
        if (await pathExists(path.join(src, "bos.config.json"))) {  // Check if the directory has bos.config.json file
            await deployAppCode(src, path.join(src, DEPLOY_DIST_FOLDER), opts);
            return;
        } else {    // Check if the directory has bos.workspace.json file
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
    
    const findingApp = log.loading(`Finding ${appName} in the workspace`, LogLevels.BUILD);
    const appSrc = apps.find((app) => app.includes(appName));
    if (!appSrc) {
        findingApp.error(`Not found ${appName} in the workspace`);
        return;
    }
    findingApp.finish(`Found ${appName} in the workspace`);

    await deployAppCode(appSrc, path.join(DEPLOY_DIST_FOLDER, appSrc), opts);
}
