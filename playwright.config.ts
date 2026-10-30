import { defineConfig } from '@playwright/test';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
export default defineConfig({
  testDir: './e2e', fullyParallel: false,
  use: { baseURL, channel: 'chrome', trace: 'retain-on-failure' },
  webServer: { command: `npm run dev -- --port ${new URL(baseURL).port || '3000'}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120000 },
});
