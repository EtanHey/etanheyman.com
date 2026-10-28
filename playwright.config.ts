import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:45320";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  outputDir: "docs.local/e2e/results",
  snapshotPathTemplate:
    "{testDir}/baselines/{platform}/{projectName}/{arg}{ext}",
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixels: 0 } },
  reporter: [
    ["list"],
    ["html", { outputFolder: "docs.local/e2e/report", open: "never" }],
  ],
  metadata: {
    dataMode: process.env.BASE_URL
      ? "external target; fixture inventory required"
      : "deterministic public snapshot",
  },
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    locale: "en-US",
    timezoneId: "UTC",
    contextOptions: { reducedMotion: "reduce" },
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop1280x800",
      use: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
    },
    {
      name: "m390390x844",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "node --import tsx e2e/support/server.ts",
        url: baseURL + "/projects",
        reuseExistingServer: false,
        timeout: 180_000,
        gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
      },
});
