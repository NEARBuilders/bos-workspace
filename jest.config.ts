import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["tests/**/*.ts"],
};

export default config;
