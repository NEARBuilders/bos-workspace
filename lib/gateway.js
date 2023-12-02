const { detectPackageManager, installDependencies } = require("nypm");
const path = require("path");
const { exec } = require("child_process");
const { log } = require("./utils");

const GATEWAY_PATH = path.join(__dirname, "..", "gateway");

async function install_gateway_packages() {
    // it's better if the gateway uses npm, because most node users have it installed
    const packageManager = await detectPackageManager(GATEWAY_PATH);
    const loading = log.loading(
        `Installing gateway packages using ${packageManager.name}`,
    );
    await installDependencies({
        cwd: GATEWAY_PATH,
        packageManager,
        silent: true,
    })
        .then(() => {
            loading.finish();
        })
        .catch((err) => {
            loading.error();
            process.stderr.write(
                `Error installing gateway packages: ${err.message}`,
            );
        });
}

async function run_gateway() {
    const packageManager = await detectPackageManager(GATEWAY_PATH);
    const loading = log.loading(`Starting gateway`);
    // Runs npm start in the gateway folder
    const child = exec(`${packageManager.command} run bw-serve`, {
        cwd: GATEWAY_PATH,
    });
    child.stdout.on("data", (data) => {
        if (data.includes("compiled successfully")) {
            loading.finish("Gateway started successfully!");
            log.log(`
    ┌─────────────────────────────────────────────────────────────┐
    │ Local Gateway Successfully Running                          │
    │                                                             │
    │ ➜ Gateway: \u001b[32mhttp://localhost:4444\u001b[0m                            │
    └─────────────────────────────────────────────────────────────┘
`);
        }
    });
    child.stderr.on("data", (data) => {
        // console.error(data);
    });
    child.on("error", (error) => {
        loading.error();
        process.stderr.write(`Error starting gateway: ${error}`);
    });
    child.on("close", (code) => {
        loading.error();
        process.stderr.write(`Gateway process exited with code ${code}`);
    });
}

module.exports = { install_gateway_packages, run_gateway };
