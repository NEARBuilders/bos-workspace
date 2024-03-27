#!/usr/bin/env tsx watch --inspect

// @ts-ignore
import { run } from './lib/cli';

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
