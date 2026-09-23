import { expect, test } from "@playwright/test";

import { designsFromEnv, primeAppearance, settle, THEMES } from "./helpers/appearance";
import { axeViolations } from "./helpers/axe";
import { checkId, evidenceFile, recordCheck, relativeEvidence, summarize } from "./helpers/results";
import { allRoutes, pathFor } from "./helpers/routes";

const designs = designsFromEnv();
const routes = allRoutes();
const CORNERS = [
  [0, 0],
  [0, 100],
  [100, 0],
  [100, 100],
] as const;

test.describe.configure({ mode: "parallel" });

/* G6: axe WCAG 2.2 AA har sahifa × til × mavzu × dizayn; panel toʻrt burchakda; klaviatura yoʻli. */
for (const design of designs) {
  for (const theme of THEMES) {
    for (const route of routes) {
      test(`axe ${design}/${theme} ${route.path}`, async ({ page }, testInfo) => {
        await primeAppearance(page, { design, theme });
        await page.goto(route.path);
        await settle(page);
        const violations = await axeViolations(page);
        await recordCheck(testInfo, "G6", {
          id: checkId(testInfo, "axe", design, theme, route.path),
          status: violations.length ? "fail" : "pass",
          detail: summarize(violations),
        });
        expect(violations).toEqual([]);
      });
    }
    test(`panel burchaklari ${design}/${theme}`, async ({ page }, testInfo) => {
      const failures: string[] = [];
      for (const [t, d] of CORNERS) {
        await primeAppearance(page, { design, theme, transparency: t, density: d });
        await page.goto(pathFor("uz", "home"));
        await settle(page);
        await page.getByTestId("appearance-open").locator("visible=true").first().click();
        await expect(page.getByTestId("appearance-panel")).toBeVisible();
        const violations = await axeViolations(page);
        if (violations.length) failures.push(`t${t}/d${d}: ${violations.join("; ")}`);
        const file = evidenceFile(testInfo, "G6", design, theme, `panel-t${t}-d${d}.png`);
        await page.screenshot({ path: file });
        await page.keyboard.press("Escape");
      }
      await recordCheck(testInfo, "G6", {
        id: checkId(testInfo, "panel-corners", design, theme),
        status: failures.length ? "fail" : "pass",
        detail: summarize(failures),
      });
      expect(failures).toEqual([]);
    });
  }

  test(`klaviatura yoʻli ${design}`, async ({ page, isMobile }, testInfo) => {
    await primeAppearance(page, { design, theme: "light" });
    await page.goto(pathFor("uz", "home"));
    await settle(page);
    const failures: string[] = [];
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
    if (first !== "skip-link") failures.push(`birinchi fokus: ${first}`);

    const langOpen = page.getByTestId("language-open").locator("visible=true").first();
    await langOpen.focus();
    await page.keyboard.press("Enter");
    if (
      !(await page
        .getByTestId("language-menu")
        .isVisible()
        .catch(() => false))
    )
      failures.push("til menyusi Enter bilan ochilmadi");
    await page.keyboard.press("Escape");
    if (
      await page
        .getByTestId("language-menu")
        .isVisible()
        .catch(() => false)
    )
      failures.push("Escape til menyusini yopmadi");

    await page.getByTestId("appearance-open").locator("visible=true").first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("appearance-panel")).toBeVisible();
    const slider = page.getByTestId("slider-transparency").locator('[role="slider"]');
    await slider.focus();
    const before = await slider.getAttribute("aria-valuenow");
    await page.keyboard.press("ArrowRight");
    const after = await slider.getAttribute("aria-valuenow");
    const text = await slider.getAttribute("aria-valuetext");
    if (before === after) failures.push("sozlagich strelka bilan oʻzgarmadi");
    if (!text || !/%/.test(text)) failures.push(`aria-valuetext: ${text}`);
    await page.keyboard.press("Escape");
    const returned = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
    if (returned !== "appearance-open") failures.push(`fokus qaytmadi: ${returned}`);

    if (isMobile) {
      await page
        .getByRole("button", { name: /menyu|меню|menu/i })
        .first()
        .click();
      const sheet = page.getByTestId("menu-sheet");
      await expect(sheet).toBeVisible();
      for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const sheet = document.querySelector('[data-testid="menu-sheet"]');
        return Boolean(sheet && document.activeElement && sheet.contains(document.activeElement));
      });
      if (!inside) failures.push("varaq fokusni ushlab turmadi");
      await page.keyboard.press("Escape");
    }

    await page.goto(pathFor("uz", "contacts"));
    await settle(page);
    const form = page.getByTestId("contact-form");
    if (await form.count()) {
      const controls = await form.locator("input, textarea, button, a").count();
      let reached = 0;
      for (let i = 0; i < controls + 6; i++) {
        await page.keyboard.press("Tab");
        if (
          await page.evaluate(() =>
            Boolean(
              document
                .querySelector('[data-testid="contact-form"]')
                ?.contains(document.activeElement),
            ),
          )
        )
          reached += 1;
      }
      if (reached < Math.min(controls, 3)) failures.push("shakl klaviaturadan toʻliq oʻtilmadi");
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(pathFor("uz", "home"));
    await settle(page);
    const reducedShot = evidenceFile(testInfo, "G6", design, "reduced-motion.png");
    await page.screenshot({ path: reducedShot, fullPage: false });
    await page.emulateMedia({ reducedMotion: null });

    await recordCheck(testInfo, "G6", {
      id: checkId(testInfo, "keyboard", design),
      status: failures.length ? "fail" : "pass",
      detail: summarize(failures),
      evidence: relativeEvidence(testInfo, reducedShot),
    });
    expect(failures).toEqual([]);
  });
}
