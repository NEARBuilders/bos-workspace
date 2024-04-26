import path from "path";
import { exec, ExecException } from "child_process";

import { BaseConfig, readConfig } from "@/lib/config";
import { buildApp } from "@/lib/build";
import { readWorkspace } from "@/lib/workspace";
import { Log, Network } from "@/lib/types";
import { readdir, remove, move } from "@/lib/utils/fs";
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
    const translating = log.loading(`[${dist}] Translating files from src/widget to src`, LogLevels.BUILD);

    const srcDir = path.join(dist, "src", "widget");
    const targetDir = path.join(dist, "src");
    
    const new_files = await readdir(srcDir).catch(() => ([]));
    const original_files = await readdir(targetDir).catch(() => ([]));
    
    for (const file of new_files) {
        await move(path.join(srcDir, file), path.join(targetDir, file), { overwrite: true }).catch(() => {
            translating.error(`Failed to translate: ${path.join(srcDir, file)}`);
        });
    }

    for (const file of original_files) {
        if (new_files.includes(file))
            continue;

        await remove(path.join(targetDir, file)).catch(() => {
            translating.error(`Failed to remove: ${path.join(targetDir, file)}`);
        });
    }

    translating.finish(`[${dist}] Translated successfully`);
}

// deploy the app widgets and modules
export async function deployAppCode(src: string, dist: string, opts: DeployOptions) {
    const deploying = log.loading(`[${src}] Deploying app`, LogLevels.BUILD);

    await buildApp(src, dist, opts.network);
    
    await translateForBosCli(dist);
    
    // Deploy using bos-cli;
    const config = await readConfig(path.join(src, "bos.config.json"), opts.network);
    
    const BOS_DEPLOY_ACCOUNT_ID = config.accounts.deploy || opts.deployAccountId;
    const BOS_SIGNER_ACCOUNT_ID = config.accounts.signer || opts.signerAccountId;
    const BOS_SIGNER_PUBLIC_KEY = opts.signerPublicKey;
    const BOS_SIGNER_PRIVATE_KEY = opts.signerPrivateKey;

    exec(
        `cd ${dist} && npx bos components deploy "${BOS_DEPLOY_ACCOUNT_ID}" sign-as "${BOS_SIGNER_ACCOUNT_ID}" network-config "${opts.network}" sign-with-plaintext-private-key --signer-public-key "${BOS_SIGNER_PUBLIC_KEY}" --signer-private-key "${BOS_SIGNER_PRIVATE_KEY}" send`,
        (error: ExecException | null, stdout: string, stderr: string) => {
            if (!error) {
                deploying.finish(`[${src}] App deployed successfully`);
                return;
            }

            deploying.error(error.message);
        }
    );
    deploying.finish(`[${src}] App deployed successfully`);
}

// publish data.json to SocialDB
export async function deployAppData(src: string, config: BaseConfig) {
}

export async function deploy(appName: string, opts: DeployOptions) {
    const src = '.';
    if (!appName) {
        const dist = path.join(src, DEPLOY_DIST_FOLDER);

        await deployAppCode(src, dist, opts);

    } else {
        const { apps } = await readWorkspace(src);
        
        const findingApp = log.loading(`Finding ${appName} in the workspace`, LogLevels.BUILD);
        const appSrc = apps.find((app) => app.includes(appName));
        if (!appSrc) {
            findingApp.error(`Not found ${appName} in the workspace`);
            return;
        }
        findingApp.finish(`Found ${appName} in the workspace`);

        const dist = path.join(DEPLOY_DIST_FOLDER, appSrc);

        await deployAppCode(appSrc, dist, opts);
    }
}
