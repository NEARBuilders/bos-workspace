const { read_bos_config } = require("./config.js");
const { generate_data_json } = require("./data.js");
const { create_dist, for_folder, for_rfile, log } = require("./utils.js");
const { process_file } = require("./parse.js");
const path = require("path");

const distFolder = process.env.DIST_FOLDER || "build";

// Main function to orchestrate the build script
async function build() {
    return for_folder(path.join(".", "apps"), (appFolder) => {
        const appName = path.basename(appFolder);
        create_dist(appName, distFolder);
        process_dist(appName, distFolder); //
        generate_data_json(appName); //
    });
}

async function build_with_log() {
    let loading = log.loading("Building the project");
    let apps = await build().catch((err) => {
        loading.error();
        log.error(err);
        process.exit(1);
    });
    loading.finish();
    log.sucess("Build complete");
    log.log(`\n${apps.length} apps built:`);
    log.log(" - " + apps.map((v) => v.split("/")[1]).join("\n - "));
    return apps;
}

// walk through each app folder
function process_dist(appName, df) {
    const config = read_bos_config(appName);
    // process.stdout.write(`Building ${appName} (${config.appAccount})...\n`);
    for_rfile(
        path.join(".", df, appName),
        ["js", "jsx", "ts", "tsx"],
        (file) => {
            process_file(file, config);
        },
    );
}

module.exports = {
    build,
    build_with_log,
};
