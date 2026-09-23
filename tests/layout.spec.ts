import { expect, test } from "@playwright/test";

import { designsFromEnv, primeAppearance, revealAll, settle, THEMES } from "./helpers/appearance";
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

const designs = designsFromEnv();
const routes = allRoutes();

/* G5: har manzil × mavzu × dizayn, oʻlcham matritsasi orqali joyida qayta oʻlchash. */
test.describe.configure({ mode: "parallel" });

for (const design of designs) {
  for (const theme of THEMES) {
    for (const route of routes) {
      test(`${design}/${theme} ${route.path}`, async ({
        page,
        browserName,
        isMobile,
      }, testInfo) => {
        await primeAppearance(page, { design, theme });
        await page.goto(route.path);
        await settle(page);
        await revealAll(page);
        const failures: string[] = [];
        for (const viewport of viewportsFor(browserName, isMobile ?? false)) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(120);
          /* Har audit alohida evaluate: funksiya manbai brauzerga oʻtadi, import yopilmalari emas. */
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
              bars: ['[data-testid="header"]', '[data-testid="tab-bar"]'],
              check: "under-header" as const,
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
              design,
              theme,
              `${route.locale}${route.path.replace(/\//g, "_")}-${viewportLabel(viewport)}.png`,
            );
            await page.screenshot({ path: file, fullPage: false });
            for (const f of findings)
              failures.push(
                `${viewportLabel(viewport)} ${f.check} ${f.target}: ${f.detail} [${relativeEvidence(testInfo, file)}]`,
              );
          }
        }
        await recordCheck(testInfo, "G5", {
          id: checkId(testInfo, design, theme, route.path),
          status: failures.length ? "fail" : "pass",
          detail: summarize(failures, 8),
        });
        expect(failures).toEqual([]);
      });
    }
  }
}
