import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  projects: [
    {
      name: "portal-chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3002"
      }
    }
  ],
  reporter: [["list"]],
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:3002"
  }
});
