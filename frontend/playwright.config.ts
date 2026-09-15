import { defineConfig, devices } from '@playwright/test';

// The two ports this project owns, derived from its creation date (2022-08-08):
// the backend at 20808, the dev server one above it. Both are read from the
// environment so a checkout that moved them does not have to edit this file.
const backendPort = Number(process.env.PORT ?? 20_808);
const devServerPort = Number(process.env.VITE_PORT ?? backendPort + 1);
const baseURL = `http://localhost:${devServerPort}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html']] : 'html',
  use: {
    baseURL,
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
      // Run node directly (no npm / --watch wrapper) so Playwright can
      // reliably kill the server when the tests are done.
      command: 'node src/server.ts',
      url: `http://localhost:${backendPort}/v1/health`,
      reuseExistingServer: !process.env.CI,
      cwd: '../backend',
    },
    {
      command: 'npm run dev',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
