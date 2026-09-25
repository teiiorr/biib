import { expect, test } from "@playwright/test";

import { primeAppearance, settle } from "./helpers/appearance";
import { checkId, recordCheck } from "./helpers/results";
import { allRoutes } from "./helpers/routes";

/* G4 (brauzer qismi): bitta h1, canonical, sarlavha darajalari tartibi, JSON-LD parse boʻladi. */
test.describe("G4 SEO", () => {
  test.skip(
    ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
    "faqat chromium-desktop",
  );
  for (const route of allRoutes()) {
    test(`${route.path}`, async ({ page }, testInfo) => {
      await primeAppearance(page, { theme: "light" });
      await page.goto(route.path);
      await settle(page);
      const result = await page.evaluate(() => {
        const h1 = document.querySelectorAll("h1").length;
        const canonical =
          document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
        const levels = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
          Number(h.tagName[1]),
        );
        let skip = false;
        for (let i = 1; i < levels.length; i++)
          if ((levels[i] ?? 1) - (levels[i - 1] ?? 1) > 1) skip = true;
        const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
          (s) => {
            try {
              JSON.parse(s.textContent ?? "");
              return true;
            } catch {
              return false;
            }
          },
        );
        return { h1, canonical, skip, jsonld };
      });
      const bad: string[] = [];
      if (result.h1 !== 1) bad.push(`h1 soni ${result.h1}`);
      if (!result.canonical.endsWith(route.path)) bad.push(`canonical ${result.canonical}`);
      if (result.skip) bad.push("sarlavha darajasi sakraydi");
      if (result.jsonld.includes(false)) bad.push("JSON-LD buzuq");
      await recordCheck(testInfo, "G4", {
        id: checkId(testInfo, route.path),
        status: bad.length ? "fail" : "pass",
        detail: bad.join("; "),
      });
      expect(bad).toEqual([]);
    });
  }
});
