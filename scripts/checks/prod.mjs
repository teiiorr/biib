import { fetchText, links, mapLimit, metaContent } from "./html.mjs";
import { SITE_URL, fail, log, pass } from "./util.mjs";

/** G12: ishlab chiqarish manzili; joylashtirishdan keyin alohida ishga tushiriladi. */
export async function runProdSmoke(ctx) {
  const base = SITE_URL;
  log(`G12: ${base}`);
  const checks = [];
  const routes = ctx.site.routes;
  const bad = [];
  await mapLimit(routes, 8, async (route) => {
    try {
      const response = await fetch(base + route.path, { redirect: "manual" });
      if (response.status !== 200) bad.push(`${route.path}: ${response.status}`);
    } catch (error) {
      bad.push(`${route.path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  checks.push(
    bad.length
      ? fail("prod:pages", bad.slice(0, 15).join("\n"))
      : pass("prod:pages", `${routes.length} URL 200`),
  );
  for (const file of ["/sitemap.xml", "/robots.txt"]) {
    const { status } = await fetchText(base + file);
    checks.push(
      status === 200 ? pass(`prod:${file.slice(1)}`) : fail(`prod:${file.slice(1)}`, `${status}`),
    );
  }
  const home = await fetchText(`${base}/uz`);
  const alternates = links(home.text).filter((l) => l.rel === "alternate" && l.hreflang);
  checks.push(
    alternates.length >= 5
      ? pass("prod:hreflang", `${alternates.length} hreflang`)
      : fail("prod:hreflang", `${alternates.length} hreflang, kamida 5 kerak`),
  );
  const og = metaContent(home.text, "og:image");
  if (!og) checks.push(fail("prod:og-image", "og:image yoʻq"));
  else {
    const response = await fetch(og);
    const type = response.headers.get("content-type") ?? "";
    checks.push(
      response.status === 200 && type.startsWith("image/")
        ? pass("prod:og-image", `${og} ${type}`)
        : fail("prod:og-image", `${og}: ${response.status} ${type}`),
    );
  }
  return checks;
}
