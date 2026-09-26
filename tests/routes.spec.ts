import { expect, test } from "@playwright/test";

import { primeAppearance, settle } from "./helpers/appearance";
import { MISSING_SEGMENT, UNKNOWN_LOCALE } from "./helpers/pages";
import { checkId, recordCheck } from "./helpers/results";
import {
  allRoutes,
  getDictionary,
  LOCALE_META,
  LOCALES,
  NEWS_SLUGS,
  pathFor,
} from "./helpers/routes";

/* G2: barcha manzillar, toʻgʻri lang, lokal 404, global 404, yoʻnaltirish, til almashtirgich. */
test.describe("G2 marshrutlar", () => {
  test("barcha manzillar 200 va toʻgʻri <html lang>", async ({ request }, testInfo) => {
    const routes = allRoutes();
    /* 9 sahifa va har yangilik, har biri besh tilda. */
    expect(routes.length).toBe((9 + NEWS_SLUGS.length) * LOCALES.length);
    const bad: string[] = [];
    for (const route of routes) {
      const response = await request.get(route.path);
      const html = await response.text();
      const meta = LOCALE_META[route.locale];
      const lang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1];
      const orthography = /<html[^>]*data-orthography="([^"]+)"/.exec(html)?.[1];
      if (response.status() !== 200) bad.push(`${route.path}: ${response.status()}`);
      if (lang !== meta.htmlLang) bad.push(`${route.path}: lang=${lang}`);
      if (route.locale === "ozbekca" && orthography !== "2026")
        bad.push(`${route.path}: data-orthography yoʻq`);
    }
    await recordCheck(testInfo, "G2", {
      id: checkId(testInfo, "routes-200-lang"),
      status: bad.length ? "fail" : "pass",
      detail: bad.join("; "),
    });
    expect(bad).toEqual([]);
  });

  test("lokal 404 har tilda oʻz tilida", async ({ request }, testInfo) => {
    const bad: string[] = [];
    for (const locale of LOCALES) {
      const response = await request.get(`${pathFor(locale, "home")}/${MISSING_SEGMENT}`);
      const html = await response.text();
      const title = getDictionary(locale).errors.notFound.title;
      if (response.status() !== 404) bad.push(`${locale}: ${response.status()}`);
      if (!html.includes(title)) bad.push(`${locale}: "${title}" yoʻq`);
    }
    await recordCheck(testInfo, "G2", {
      id: checkId(testInfo, "local-404"),
      status: bad.length ? "fail" : "pass",
      detail: bad.join("; "),
    });
    expect(bad).toEqual([]);
  });

  test("nomaʼlum til global 404", async ({ request }, testInfo) => {
    const response = await request.get(`/${UNKNOWN_LOCALE}/`);
    const html = await response.text();
    const ok = response.status() === 404 && LOCALES.every((l) => html.includes(pathFor(l, "home")));
    await recordCheck(testInfo, "G2", {
      id: checkId(testInfo, "global-404"),
      status: ok ? "pass" : "fail",
      detail: `status ${response.status()}`,
    });
    expect(ok).toBe(true);
  });

  test("/ → /uz (307)", async ({ request }, testInfo) => {
    const response = await request.get("/", { maxRedirects: 0 });
    const ok = response.status() === 307 && (response.headers().location ?? "").endsWith("/uz");
    await recordCheck(testInfo, "G2", {
      id: checkId(testInfo, "root-redirect"),
      status: ok ? "pass" : "fail",
      detail: `${response.status()} ${response.headers().location ?? ""}`,
    });
    expect(ok).toBe(true);
  });

  test("til almashtirgich sahifa va slugni saqlaydi", async ({ page }, testInfo) => {
    await primeAppearance(page);
    const slug = NEWS_SLUGS[0];
    await page.goto(pathFor("uz", "newsItem", slug));
    await settle(page);
    await page.getByTestId("language-open").locator("visible=true").first().click();
    const menu = page.getByTestId("language-menu");
    await expect(menu).toBeVisible();
    const bad: string[] = [];
    for (const locale of LOCALES) {
      const expected = pathFor(locale, "newsItem", slug);
      const link = menu
        .locator(`a[hreflang="${LOCALE_META[locale].htmlLang}"]`)
        .filter({ hasText: LOCALE_META[locale].nativeName });
      const href = await link.first().getAttribute("href");
      if (href !== expected) bad.push(`${locale}: ${href} ≠ ${expected}`);
    }
    await recordCheck(testInfo, "G2", {
      id: checkId(testInfo, "language-switcher"),
      status: bad.length ? "fail" : "pass",
      detail: bad.join("; "),
    });
    expect(bad).toEqual([]);
  });
});
