const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start --workspace=backend',
      port: 3030,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run start --workspace=frontend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
