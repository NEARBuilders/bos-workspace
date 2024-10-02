const rspack = require("@rspack/core");
const paths = require("./config/paths");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const loadPreset = require("./config/presets/loadPreset");
const loadConfig = (mode) => require(`./config/rspack.${mode}.js`)(mode);

module.exports = function (env) {
  const { mode = "production" } = env || {};
  return merge(
    {
      mode,
      entry: `${paths.srcPath}/index.js`,
      output: {
        path: paths.distPath,
        filename: "[name].bundle.js",
        publicPath: "/",
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
          {
            test: /\.(j|t)s$/,
            exclude: [/[\\/]node_modules[\\/]/],
            loader: "builtin:swc-loader",
            /** @type {import('@rspack/core').SwcLoaderOptions} */
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                  jsx: true,
                },
                externalHelpers: true,
              },
              env: {
                targets: "Chrome >= 48",
              },
            },
            type: 'javascript/auto',
          },
          // Images: Copy image files to build folder
          { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: "asset/resource" },

          // Fonts and SVGs: Inline files
          { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: "asset/inline" },
        ],
      },
      resolve: {
        modules: [paths.srcPath, "node_modules"],
        extensions: [".js", ".jsx", ".json"],
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          fs: false,
          path: require.resolve("path-browserify"),
          zlib: require.resolve("browserify-zlib"),
          vm: require.resolve("vm-browserify"),
        },
        // Fix for using `yarn link "near-social-vm"`
        alias: {
          react: path.resolve(__dirname, "./node_modules/react"),
          "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
          "near-api-js": path.resolve(__dirname, "./node_modules/near-api-js"),
        },
      },
      plugins: [
        new rspack.EnvironmentPlugin({
          // Configure environment variables here.
          ENVIRONMENT: "browser",
        }),
        new CleanWebpackPlugin(),
        // Copies files from target to destination folder
        new rspack.CopyRspackPlugin({
          patterns: [
            {
              from: paths.publicPath,
              to: "./",
              globOptions: {
                ignore: ["**/*.DS_Store", "**/index.html", "**/favicon.png"],
              },
              noErrorOnMissing: true,
            },
          ],
        }),
        new rspack.HtmlRspackPlugin({
          template: `${paths.publicPath}/index.html`,
          publicPath: process.env.PUBLIC_PATH ?? "/",
          minify: false,
        }),
        new rspack.HtmlRspackPlugin({
          template: `${paths.publicPath}/index.html`,
          filename: "404.html",
          publicPath: process.env.PUBLIC_PATH ?? "/",
          minify: false,
        }),
        new rspack.ProgressPlugin(),
        new rspack.ProvidePlugin({
          process: "process/browser",
          Buffer: [require.resolve("buffer/"), "Buffer"],
        }),
      ],
    },
    loadConfig(mode),
    loadPreset(env),
  );
};
