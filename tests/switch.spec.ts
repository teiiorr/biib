import { expect, test } from "@playwright/test";

import {
  designsFromEnv,
  otherDesign,
  primeAppearance,
  readStoredAppearance,
  settle,
} from "./helpers/appearance";
import { PAGE_TYPES, pagePath } from "./helpers/pages";
import { checkId, recordCheck, summarize } from "./helpers/results";

const designs = designsFromEnv();

/* G13: almashinuv manzil, til, mavzu, sozlagichlar va kontent langarini saqlaydi; qayta yuklashda miltillash yoʻq. */
test.describe("G13 dizayn almashinuvi", () => {
  test.skip(
    ({ browserName }) => browserName === "firefox",
    "View Transitions Firefox da yoʻq: zaxira soʻnish alohida tekshiriladi",
  );
  for (const design of designs) {
    for (const type of PAGE_TYPES) {
      test(`${design} → ${otherDesign(design)} ${type}`, async ({ page }, testInfo) => {
        const target = otherDesign(design);
        await primeAppearance(page, { design, theme: "dark", transparency: 30, density: 70 });
        const path = pagePath("uz", type);
        await page.goto(path);
        await settle(page);
        await page.evaluate(() =>
          window.scrollTo(0, Math.min(600, document.documentElement.scrollHeight / 3)),
        );
        await page.waitForTimeout(200);
        const anchorBefore = await page.evaluate(() => {
          const heads = [...document.querySelectorAll("main h1, main h2, main h3")];
          const visible = heads.find(
            (h) =>
              h.getBoundingClientRect().bottom > 0 && h.getBoundingClientRect().top < innerHeight,
          );
          return visible?.textContent?.trim() ?? null;
        });
        await page.getByTestId("appearance-open").locator("visible=true").first().click();
        await expect(page.getByTestId("appearance-panel")).toBeVisible();
        await page.getByTestId(`design-${target}`).click();
        await expect
          .poll(() => page.evaluate(() => document.documentElement.getAttribute("data-design")))
          .toBe(target);
        await page.waitForTimeout(1100);
        const failures: string[] = [];
        const url = new URL(page.url());
        if (url.pathname !== path) failures.push(`yoʻl oʻzgardi: ${url.pathname}`);
        if (url.search) failures.push(`manzilda ${url.search}`);
        const html = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          theme: document.documentElement.getAttribute("data-theme"),
          t: document.documentElement.style.getPropertyValue("--g-t"),
          d: document.documentElement.style.getPropertyValue("--g-d"),
        }));
        if (html.lang !== "uz-Latn") failures.push(`lang ${html.lang}`);
        if (html.theme !== "dark") failures.push(`mavzu ${html.theme}`);
        if (html.t !== "0.3" || html.d !== "0.7") failures.push(`sozlagichlar ${html.t}/${html.d}`);
        const stored = await readStoredAppearance(page);
        if (stored.design !== target || stored.transparency !== 30 || stored.density !== 70)
          failures.push("localStorage saqlanmadi");
        const anchorAfter = await page.evaluate((text) => {
          if (!text) return true;
          const heads = [...document.querySelectorAll("main h1, main h2, main h3")];
          const el = heads.find((h) => h.textContent?.trim() === text);
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.bottom > -40 && r.top < innerHeight + 40;
        }, anchorBefore);
        if (!anchorAfter) failures.push("kontent langari koʻrinishdan chiqib ketdi");

        /* Qayta yuklash: birinchi kadrda saqlangan dizayn foni koʻrinadi (miltillash yoʻq). */
        await page.goto(path, { waitUntil: "commit" });
        const early = await page.evaluate(() => ({
          design: document.documentElement.getAttribute("data-design"),
          theme: document.documentElement.getAttribute("data-theme"),
        }));
        if (early.design !== target || early.theme !== "dark")
          failures.push(`qayta yuklashda ${early.design}/${early.theme}`);

        await recordCheck(testInfo, "G13", {
          id: checkId(testInfo, design, target, type),
          status: failures.length ? "fail" : "pass",
          detail: summarize(failures),
        });
        expect(failures).toEqual([]);
      });
    }
  }
});
