import { LinkChecker } from "linkinator";
import { fetchText, pathOf } from "./html.mjs";
import { checkPages } from "./seo-pages.mjs";
import { BASE_URL, fail, pass } from "./util.mjs";

export const summarize = (id, hits, note) =>
  hits.length
    ? fail(id, hits.slice(0, 12).join("\n") + (hits.length > 12 ? `\n… jami ${hits.length}` : ""))
    : pass(id, note);

/** Sahifa uchun kutilgan hreflang xaritasi: klaster tillari + x-default; ozbekca aʼzo emas. */
export function expectedHreflang(route, routes, localeMeta) {
  const out = {};
  for (const other of routes) {
    if (other.key !== route.key || other.slug !== route.slug) continue;
    const tag = localeMeta[other.locale]?.hreflang;
    if (tag) out[tag] = other.path;
    if (other.locale === "uz") out["x-default"] = other.path;
  }
  return out;
}

export async function checkSitemap(routes, localeMeta) {
  const { status, text } = await fetchText(`${BASE_URL}/sitemap.xml`);
  if (status !== 200) return [fail("seo:sitemap", `/sitemap.xml ${status}`)];
  const entries = [...text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: pathOf(m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ""),
    alternates: [...m[1].matchAll(/<xhtml:link[^>]*>/g)].map((l) => ({
      hreflang: l[0].match(/hreflang="([^"]+)"/)?.[1] ?? "",
      href: pathOf(l[0].match(/href="([^"]+)"/)?.[1] ?? ""),
    })),
  }));
  const hits = [];
  const expected = new Set(routes.map((r) => r.path));
  if (entries.length !== expected.size)
    hits.push(`${entries.length} ta URL, ${expected.size} kerak`);
  const seen = new Set(entries.map((e) => e.loc));
  for (const p of expected) if (!seen.has(p)) hits.push(`sitemapda yoʻq: ${p}`);
  for (const e of entries) {
    if (!expected.has(e.loc)) hits.push(`ortiqcha: ${e.loc}`);
    if (!/^[a-z0-9/-]+$/.test(e.loc)) hits.push(`${e.loc}: yoʻl faqat [a-z0-9/-] boʻlishi kerak`);
    const route = routes.find((r) => r.path === e.loc);
    if (!route) continue;
    if (e.alternates.some((a) => a.href.startsWith("/ozbekca")))
      hits.push(`${e.loc}: /ozbekca hreflang aʼzosi boʻlmasligi kerak`);
    if (route.locale === "ozbekca") {
      if (e.alternates.length) hits.push(`${e.loc}: ozbekca sahifada hreflang boʻlmaydi`);
      continue;
    }
    const want = expectedHreflang(route, routes, localeMeta);
    if (!e.alternates.some((a) => a.href === e.loc))
      hits.push(`${e.loc}: alternates oʻzini oʻz ichiga olmaydi`);
    for (const [tag, href] of Object.entries(want))
      if (!e.alternates.some((a) => a.hreflang === tag && a.href === href))
        hits.push(`${e.loc}: hreflang ${tag} → ${href} yoʻq`);
    for (const a of e.alternates)
      if (want[a.hreflang] !== a.href)
        hits.push(`${e.loc}: kutilmagan hreflang ${a.hreflang} → ${a.href}`);
  }
  return [summarize("seo:sitemap", hits, `${entries.length} URL`)];
}

export async function checkRobots() {
  const { status, text } = await fetchText(`${BASE_URL}/robots.txt`);
  const hits = [];
  if (status !== 200) hits.push(`/robots.txt ${status}`);
  if (!/^Sitemap:\s*\S+\/sitemap\.xml/im.test(text)) hits.push("Sitemap: qatori yoʻq");
  if (/^Disallow:\s*\/\s*$/im.test(text)) hits.push("Disallow: / hammasini yopadi");
  return [summarize("seo:robots", hits)];
}

export async function checkLinks(pages) {
  const checker = new LinkChecker();
  const result = await checker.check({
    path: [
      `${BASE_URL}/uz`,
      `${BASE_URL}/ru`,
      `${BASE_URL}/en`,
      `${BASE_URL}/oz`,
      `${BASE_URL}/ozbekca`,
    ],
    recurse: true,
    concurrency: 8,
    timeout: 20_000,
    linksToSkip: async (link) => !link.startsWith(BASE_URL),
  });
  const broken = result.links
    .filter((l) => l.state === "BROKEN")
    .map((l) => `${l.url} (${l.status ?? "?"}) ← ${l.parent ?? ""}`);
  const hasUpop =
    result.links.some((l) => /upop\.uz/i.test(l.url)) ||
    [...pages.values()].some((html) => /https?:\/\/(?:www\.)?upop\.uz/i.test(html));
  return [
    summarize("seo:links", broken, `${result.links.length} havola`),
    hasUpop ? pass("seo:upop-link") : fail("seo:upop-link", "upop.uz havolasi topilmadi"),
  ];
}

export async function runSeo(ctx) {
  const { routes, localeMeta } = ctx.site;
  const checks = [...(await checkSitemap(routes, localeMeta)), ...(await checkRobots())];
  const { pages, checks: pageChecks } = await checkPages(routes, localeMeta);
  checks.push(...pageChecks, ...(await checkLinks(pages)));
  return checks;
}
