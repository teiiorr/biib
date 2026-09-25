import { expect, test } from "@playwright/test";

import { primeAppearance, revealAll, settle, THEMES } from "./helpers/appearance";
import { PAGE_TYPES, pagePath } from "./helpers/pages";
import { checkId, recordCheck } from "./helpers/results";
import { VISUAL_VIEWPORTS, viewportLabel } from "./helpers/viewports";

/* Etalon fayl nomlari oldingi yurishlardagi Atlas skrinshotlari bilan bir xil qoladi: solishtirish uzilmaydi. */
const BASELINE_PREFIX = "atlas";

/* G8: etalon skrinshotlar — 11 sahifa turi × uz × 2 mavzu × 390/820/1440. */
test.describe("G8 vizual etalonlar", () => {
  test.skip(
    ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
    "faqat chromium-desktop",
  );
  for (const theme of THEMES) {
    for (const type of PAGE_TYPES) {
      test(`${theme}/${type}`, async ({ page }, testInfo) => {
        await primeAppearance(page, { theme, motion: false });
        await page.goto(pagePath("uz", type));
        await settle(page);
        await revealAll(page);
        for (const viewport of VISUAL_VIEWPORTS) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(200);
          await expect(page).toHaveScreenshot(
            `${BASELINE_PREFIX}-${theme}-${type}-${viewportLabel(viewport)}.png`,
            {
              fullPage: true,
              mask: [page.locator("video")],
            },
          );
        }
        await recordCheck(testInfo, "G8", {
          id: checkId(testInfo, theme, type),
          status: "pass",
        });
      });
    }
  }
});
