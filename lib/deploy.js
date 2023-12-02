const { read_bos_config } = require("./config");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const distFolder = process.env.DIST_FOLDER || "build";

// TODO: need tests
function deploy_app(appFolder) {
    const config = read_bos_config(appFolder);
    const appAccount = config.appAccount;

    if (!appAccount) {
        console.error(
            `App account is not defined for ${appFolder}. Skipping deployment.`,
        );
        return;
    }

    const packageRoot = path.resolve(__dirname, "..");
    const bosBinaryPath = path.join(packageRoot, "node_modules", ".bin", "bos");

    const command = [
        bosBinaryPath,
        "components",
        "deploy",
        `'${appAccount}'`,
        "sign-as",
        `'${appAccount}'`,
        "network-config",
        "mainnet",
    ].join(" ");

    try {
        execSync(command, {
            cwd: path.join(distFolder, appFolder),
            stdio: "inherit",
        }).toString();
        console.log(`Deployed ${appFolder}`);
    } catch (error) {
        console.error(
            `Error deploying ${appFolder} widgets:\n${error.message}`,
        );
    }
}

function deploy_data(appFolder) {
    const config = read_bos_config(appFolder);
    const appAccount = config.appAccount;

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
    const args = {
        data: {
            [appAccount]: JSON.parse(dataJSON),
        },
    };

    const argsBase64 = Buffer.from(JSON.stringify(args)).toString("base64");

    const packageRoot = path.resolve(__dirname, "..");
    const nearBinaryPath = path.join(
        packageRoot,
        "node_modules",
        ".bin",
        "near",
    );

    const command = [
        nearBinaryPath,
        "contract",
        "call-function",
        "as-transaction",
        "social.near",
        "set",
        "base64-args",
        `'${argsBase64}'`,
        "prepaid-gas",
        "'300.000 TeraGas'",
        "attached-deposit",
        "'0.001 NEAR'",
        "sign-as",
        appAccount,
        "network-config",
        "mainnet",
    ].join(" ");

    try {
        execSync(command, {
            cwd: path.join(distFolder, appFolder),
            stdio: "inherit",
        }).toString();
        console.log(`Uploaded data for ${appFolder}`);
    } catch (error) {
        console.error(
            `Error uploading data for ${appFolder}:\n${error.message}`,
        );
    }
}

module.exports = {
    deploy_app,
    deploy_data,
};
