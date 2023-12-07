import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const myRules = {
  // https://eslint.org/docs/latest/rules/max-len
  // Temporary rule to see if eslint will work:
  //'max-len': ['warn', { code: 3, ignoreComments: false, ignoreRegExpLiterals: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
};

export default [
  {
    rules: myRules,
  },
  {
    ignores: ["build/*", "node_modules/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      ts,
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,
      ...myRules,
      "ts/return-await": 2,
    },
  },
];