#!/usr/bin/env node

"use strict";

const { run } = require("../dist/lib/cli.js");

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
