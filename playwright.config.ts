import { cpus } from "node:os";
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";

/**
 * Beshta dvigatel profili (§16.2): WebKit iPhone va Chromium Android telefon oʻlchamlarini,
 * kompyuter profillari katta oʻlchamlarni yuradi. Natijalar gate-check ilovalari orqali
 * tests/reporter.ts da .verify/results/<gate>.json ga yigʻiladi.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  retries: 0,
  workers: Math.max(2, Math.floor(cpus().length / 2)),
  timeout: 180_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  reporter: [
    ["list"],
    ["json", { outputFile: ".verify/results/playwright.json" }],
    ["./tests/reporter.ts"],
  ],
  outputDir: "test-results",
  /* Birinchi yurishda yoʻq etalon yoziladi, yiqilmaydi; yangilash faqat koʻrib chiqilgan yaxshilanishdan keyin. */
  updateSnapshots: "missing",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "uz-Latn",
    colorScheme: "light",
  },
  projects: [
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"], browserName: "chromium" },
    },
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 15"], browserName: "webkit" },
    },
    {
      name: "webkit-desktop",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "firefox-desktop",
      use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
    },
  ],
});
