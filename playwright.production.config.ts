import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";

const baseURL = process.env.PROD_BASE_URL;
// Exact strings also reject credentials, ports, paths, query/hash and URL normalization tricks.
if (baseURL !== "https://etanheyman.com" && baseURL !== "https://www.etanheyman.com") {
  throw new Error("Set PROD_BASE_URL explicitly to https://etanheyman.com or https://www.etanheyman.com");
}

// Playwright re-evaluates config in children; inherit one ID from the CLI process.
const runId = process.env.PORTFOLIO_AUDIT_RUN_ID ?? `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
if (!/^[A-Za-z0-9-]+$/.test(runId)) throw new Error("Invalid internal production-audit run ID");
process.env.PORTFOLIO_AUDIT_RUN_ID = runId;
const runDirectory = `docs.local/production-audit/${runId}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "production-audit.prod.ts",
  outputDir: `${runDirectory}/results`,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: true,
  reporter: [
    ["list"],
    ["html", { outputFolder: `${runDirectory}/report`, open: "never" }],
  ],
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    navigationTimeout: 10_000,
    actionTimeout: 3_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop1280x800", use: { viewport: { width: 1280, height: 800 } } },
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
});
