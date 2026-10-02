import { cpus } from "node:os";
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";

/**
 * Telefon oʻlchamlarini WebKit (iPhone) va Chromium (Android), katta oʻlchamlarni kompyuter profillari
 * tekshiradi. Natijalarni tests/reporter.ts har bir tekshiruv uchun .verify/results papkasiga yigʻadi.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  retries: 0,
  workers: Math.max(2, cpus().length - 2),
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
  /* Etalon yoʻq boʻlsa test yiqilmaydi, yangisi yoziladi; borini faqat koʻrib chiqilgandan keyin yangilang. */
  updateSnapshots: "missing",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "uz-Latn",
    colorScheme: "dark",
  },
  projects: [
    /* Yangi headless rejim Metal bilan ishlaydi, kadrlar SwiftShader emas, haqiqiy videokartada oʻlchanadi. */
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"], browserName: "chromium", channel: "chromium" },
    },
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
        viewport: { width: 1440, height: 900 },
      },
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
