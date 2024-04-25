import express from 'express';
import http from 'http';
import supertest from 'supertest';
import fetchMock from 'jest-fetch-mock';
import { DEFAULT_CONFIG } from '@/lib/config';
import { dev, DevOptions } from '@/lib/dev'; // Update with the correct path to your server file
import { LogLevel, Logger } from "@/lib/logger";

import { vol } from 'memfs';
jest.mock('fs', () => require('memfs').fs);
jest.mock('fs/promises', () => require('memfs').fs.promises);

const unmockedLog = global.log;

// Mock fetch
fetchMock.enableMocks();

const app_example_1 = {
  "./bos-loader.json": JSON.stringify({"components":{"test.testnet/widget/home":{"code":"retrun <p>hello world</p>"}},"data":{}}),
};

// Mock express app
const app = express();

// Mock express server
const server = http.createServer(app);

describe('dev', () => {
  
});
