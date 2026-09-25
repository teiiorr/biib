import { expect, test } from "@playwright/test";

import { applyTheme, primeAppearance, revealAll, settle, THEMES } from "./helpers/appearance";
import { auditAlignment } from "./helpers/audit/alignment";
import { auditUnderBars } from "./helpers/audit/bars";
import { auditCards } from "./helpers/audit/cards";
import { auditClip } from "./helpers/audit/clip";
import { auditIcons } from "./helpers/audit/icons";
import { auditInteractive } from "./helpers/audit/interactive";
import { auditSpacing } from "./helpers/audit/spacing";
import { SPACING_SCALE, type Finding } from "./helpers/audit/types";
import { checkId, evidenceFile, recordCheck, relativeEvidence, summarize } from "./helpers/results";
import { allRoutes } from "./helpers/routes";
import { viewportLabel, viewportsFor } from "./helpers/viewports";

const routes = allRoutes();

/*
 * G5: har manzil bir marta yuklanadi, mavzu sahifa ichida almashtiriladi,
 * oʻlcham matritsasi joyida qayta oʻlchanadi. Auditlar SVG naqsh daraxtlarini oʻtkazib yuboradi.
 */
test.describe.configure({ mode: "parallel" });

for (const route of routes) {
  test(`${route.path}`, async ({ page, browserName, isMobile }, testInfo) => {
    await primeAppearance(page, { theme: "light", motion: false });
    await page.goto(route.path);
    await settle(page);
    await revealAll(page);
    const failures: string[] = [];
    const viewports = viewportsFor(browserName, isMobile ?? false);
    for (const theme of THEMES) {
      await applyTheme(page, theme);
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(80);
        const overflow: Finding[] = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth > window.innerWidth + 1
            ? [
                {
                  check: "overflow" as const,
                  target: "html",
                  detail: `${doc.scrollWidth} > ${window.innerWidth}`,
                },
              ]
            : [];
        });
        const findings: Finding[] = [
          ...overflow,
          ...(await page.evaluate(auditClip)),
          ...(await page.evaluate(auditInteractive)),
          ...(await page.evaluate(auditUnderBars, {
            bars: ['[data-testid="header"]'],
            check: "under-header" as const,
          })),
          ...(await page.evaluate(auditUnderBars, {
            bars: ['[data-testid="tab-bar"]'],
            check: "under-tabbar" as const,
          })),
          ...(await page.evaluate(auditAlignment, {
            gridItem: "[data-grid-item]",
            container: ".container-site",
            tolerance: 0.5,
          })),
          ...(await page.evaluate(auditSpacing, {
            selector: "[data-audit]",
            scale: [...SPACING_SCALE],
            tolerance: 0.5,
          })),
          ...(await page.evaluate(auditCards, {
            group: "[data-card-group]",
            card: "[data-card]",
            title: "[data-card-title]",
            cta: "[data-card-cta]",
            tolerance: 1,
          })),
          ...(await page.evaluate(auditIcons, {
            selector: "[data-icon-optical]",
            tolerance: 0.5,
          })),
        ];
        if (findings.length) {
          const file = evidenceFile(
            testInfo,
            "G5",
            theme,
            `${route.locale}${route.path.replace(/\//g, "_")}-${viewportLabel(viewport)}.png`,
          );
          await page.screenshot({ path: file, fullPage: false });
          for (const f of findings) {
            failures.push(
              `${theme} ${viewportLabel(viewport)} ${f.check} ${f.target}: ${f.detail} [${relativeEvidence(testInfo, file)}]`,
            );
          }
        }
      }
    }
    await recordCheck(testInfo, "G5", {
      id: checkId(testInfo, route.path),
      status: failures.length ? "fail" : "pass",
      detail: summarize(failures, 10),
    });
    expect(failures).toEqual([]);
  });
}
