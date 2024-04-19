import path from "path";
import { exec, ExecException } from "child_process";
import { BaseConfig, readConfig } from "./config";
import { buildApp } from "./build";
import { readWorkspace } from "./workspace";
import { Network } from "./types";
import { readdir, rename, remove } from "@/lib/utils/fs";

const DEPLOY_DIST_FOLDER = "build";

export type DeployOptions = {
    deployAccountId: string;
    signerAccountId: string;
    signerPublicKey: string;
    signerPrivateKey: string;
    network?: Network;
};

// deploy the app widgets and modules
export async function deployAppCode(src: string, dist: string, opts: DeployOptions) {
    const deploying = log.loading(`[${src}] Deploying app`, LogLevels.BUILD);

    const config = await readConfig(path.join(src, "bos.config.json"), opts.network);

    // Move files from "src/widget" to "src/"
    const srcDir = path.join(dist, "src", "widget");
    const targetDir = path.join(dist, "src");

    const original_files = await readdir(targetDir).catch(() => ([]));
    for (const file of original_files) {
        if (file == "widget")
            continue;
        
        await remove(file).catch(() => {
            deploying.error(`Failed to remove ${path.join(targetDir, file)}`);
        })
    }

    const new_files = await readdir(srcDir).catch(() => ([]));
    if (new_files.length === 0) {
        deploying.error(`Failed to read ${srcDir}`);
        return;
    }

    for (const file of new_files) {
        rename(path.join(srcDir, file), path.join(targetDir, file)).catch(() => {
            deploying.error(`Failed to move ${path.join(srcDir, file)}`);
        });
    }

    remove(path.join(targetDir, "widget")).catch(() => {
        deploying.error(`Failed to remove widget`);
    });

    // Deploy using bos-cli;
    const BOS_DEPLOY_ACCOUNT_ID = config.accounts.deploy || opts.deployAccountId;
    const BOS_SIGNER_ACCOUNT_ID = config.accounts.signer || opts.signerAccountId;
    const BOS_SIGNER_PUBLIC_KEY = opts.signerPublicKey;
    const BOS_SIGNER_PRIVATE_KEY = opts.signerPrivateKey;

    await exec(
        `cd ${dist} && npx bos components deploy "${BOS_DEPLOY_ACCOUNT_ID}" sign-as "${BOS_SIGNER_ACCOUNT_ID}" network-config "${opts.network}" sign-with-plaintext-private-key --signer-public-key "${BOS_SIGNER_PUBLIC_KEY}" --signer-private-key "${BOS_SIGNER_PRIVATE_KEY}" send`,
        (error: ExecException | null, stdout: string, stderr: string) => {
            if (!error) {
                deploying.finish(`[${src}] App deployed successfully`);
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
    const src = ".";
    if (!appName) {
        const dist = path.join(src, DEPLOY_DIST_FOLDER);
        await buildApp(src, dist, opts.network);

        deployAppCode(src, dist, opts);
        
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
        await buildApp(appSrc, dist, opts.network);
        
        deployAppCode(appSrc, dist, opts);
    }
}
