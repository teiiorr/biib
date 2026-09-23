import { expect, test } from "@playwright/test";

import { designsFromEnv, primeAppearance, revealAll, settle, THEMES } from "./helpers/appearance";
import { PAGE_TYPES, pagePath } from "./helpers/pages";
import { checkId, recordCheck } from "./helpers/results";
import { VISUAL_VIEWPORTS, viewportLabel } from "./helpers/viewports";

const designs = designsFromEnv();

/* G8: etalon skrinshotlar — 11 sahifa turi × uz × 2 mavzu × 2 dizayn × 390/820/1440. */
test.describe("G8 vizual etalonlar", () => {
  test.skip(
    ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
    "faqat chromium-desktop",
  );
  for (const design of designs) {
    for (const theme of THEMES) {
      for (const type of PAGE_TYPES) {
        test(`${design}/${theme}/${type}`, async ({ page }, testInfo) => {
          await primeAppearance(page, { design, theme, motion: false });
          await page.goto(pagePath("uz", type));
          await settle(page);
          await revealAll(page);
          for (const viewport of VISUAL_VIEWPORTS) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(200);
            await expect(page).toHaveScreenshot(
              `${design}-${theme}-${type}-${viewportLabel(viewport)}.png`,
              {
                fullPage: true,
                mask: [page.locator(".abr-canvas"), page.locator("video")],
              },
            );
          }
          await recordCheck(testInfo, "G8", {
            id: checkId(testInfo, design, theme, type),
            status: "pass",
          });
        });
      }
    }
  }
});
