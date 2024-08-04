import { DEFAULT_GATEWAY, DevOptions } from '@/lib/dev';
import { handleReplacements, modifyIndexHtml } from '@/lib/gateway';
import { Logger, LogLevel } from "@/lib/logger";
import { Network } from '@/lib/types';
import { JSDOM } from 'jsdom';

const unmockedLog = global.log;

const baseHtml = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="bw-root"></div>
      </body>
    </html>
  `;

describe("gateway", () => {

  beforeEach(() => {
    global.log = new Logger(LogLevel.DEV);
  });

  afterEach(() => {
    global.log = unmockedLog;
  });

  // Mocked input options
  const mockOpts: DevOptions = {
    port: 8080,
    hot: false,
    network: 'testnet' as Network,
    index: "test/widget/index"
  };

  // Test replacement of environment configuration
  it("should replace the ENV_CONFIG placeholder with correct JSON configuration", () => {
    const htmlInput = "<html><head>%ENV_CONFIG%</head><body></body></html>";
    const expectedConfig = JSON.stringify({
      enableHotReload: mockOpts.hot,
      network: mockOpts.network,
    });
    const expectedHtmlOutput = `<html><head>${expectedConfig}</head><body></body></html>`;

    const result = handleReplacements(htmlInput, mockOpts);
    expect(result).toBe(expectedHtmlOutput);
  });


  it('adds script tags for dependencies', () => {
    const dependencies = ['dep1.js', 'dep2.js'];
    const result = modifyIndexHtml(baseHtml, mockOpts, dependencies, DEFAULT_GATEWAY);
    const dom = new JSDOM(result);
    const scripts = dom.window.document.querySelectorAll('script');

    expect(scripts[0].src).toBe('dep1.js');
    expect(scripts[1].src).toBe('dep2.js');
    expect(scripts[0].defer).toBe(true);
    expect(scripts[1].defer).toBe(true);
  });

  it('creates and configures near-social-viewer element', () => {
    const result = modifyIndexHtml(baseHtml, mockOpts, [], DEFAULT_GATEWAY);
    const dom = new JSDOM(result);
    const viewer = dom.window.document.querySelector('near-social-viewer');

    expect(viewer).not.toBeNull();
    expect(viewer.getAttribute('src')).toBe(mockOpts.index);
    expect(viewer.getAttribute('rpc')).toBe(`http://127.0.0.1:${mockOpts.port}/api/proxy-rpc`);
    expect(viewer.getAttribute('network')).toBe(mockOpts.network);
  });

  it('sets correct config attribute on near-social-viewer', () => {
    const result = modifyIndexHtml(baseHtml, mockOpts, [], DEFAULT_GATEWAY);
    const dom = new JSDOM(result);
    const viewer = dom.window.document.querySelector('near-social-viewer');

    const config = JSON.parse(viewer.getAttribute('config'));
    expect(config.dev.hotreload.enabled).toBe(false);
    expect(config.vm.features.enableComponentSrcDataKey).toBe(true);
  });

  it('appends near-social-viewer to the container', () => {
    const result = modifyIndexHtml(baseHtml, mockOpts, [], DEFAULT_GATEWAY);
    const dom = new JSDOM(result);
    const container = dom.window.document.getElementById('bw-root');

    expect(container.children.length).toBe(1);
    expect(container.children[0].tagName).toBe('NEAR-SOCIAL-VIEWER');
  });

  it('uses provided options correctly', () => {
    const customOpts = {
      index: 'test.near/widget/index',
      port: 4000,
      network: 'mainnet' as Network,
      hot: false
    };
    const result = modifyIndexHtml(baseHtml, customOpts, [], DEFAULT_GATEWAY);
    const dom = new JSDOM(result);
    const viewer = dom.window.document.querySelector('near-social-viewer');

    expect(viewer.getAttribute('src')).toBe(customOpts.index);
    expect(viewer.getAttribute('rpc')).toBe(`http://127.0.0.1:${customOpts.port}/api/proxy-rpc`);
    expect(viewer.getAttribute('network')).toBe(customOpts.network);

    const config = JSON.parse(viewer.getAttribute('config'));
    expect(config.dev.hotreload.enabled).toBe(false);
  });

  it('uses the tag name from the gateway config', () => {
    const tagName = "test-element"
    const gatewayConfig = DEFAULT_GATEWAY;
    gatewayConfig.tagName = tagName

    const result = modifyIndexHtml(baseHtml, mockOpts, [], gatewayConfig);
    const dom = new JSDOM(result);
    const container = dom.window.document.querySelector(tagName);

    expect(container.getAttribute('src')).toBe(mockOpts.index);
  });
});