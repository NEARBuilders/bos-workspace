#!/usr/bin/env node

"use strict";

const { run } = require("../build/lib/cli.js");

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
