import { HtmlValidate, StaticConfigLoader } from "html-validate";
import sharp from "sharp";
import {
  countTag,
  fetchText,
  htmlLang,
  isNoindex,
  jsonLd,
  links,
  mapLimit,
  metaContent,
  pathOf,
  title,
  toLocal,
} from "./html.mjs";
import { expectedHreflang, summarize } from "./seo.mjs";
import { BASE_URL, log } from "./util.mjs";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const REQUIRED_FIELDS = {
  Organization: ["name", "url", "sameAs"],
  WebSite: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  NewsArticle: ["headline", "datePublished"],
  Person: ["name"],
};

async function ogImage(html, sink) {
  const src = metaContent(html, "og:image");
  if (!src) return "og:image yoʻq";
  const response = await fetch(toLocal(src, BASE_URL));
  if (response.status !== 200) return `og:image ${response.status}`;
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/png")) return `og:image turi ${type}, image/png kerak`;
  const meta = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
  if (meta.width !== 1200 || meta.height !== 630)
    return `og:image ${meta.width}×${meta.height}, 1200×630 kerak`;
  sink.ogChecked = (sink.ogChecked ?? 0) + 1;
  return null;
}

function jsonLdIssues(html) {
  const issues = [];
  const noindex = isNoindex(html);
  for (const item of jsonLd(html)) {
    if (item.error) {
      issues.push(`JSON-LD oʻqilmadi: ${item.error}`);
      continue;
    }
    const type = Array.isArray(item.data["@type"]) ? item.data["@type"][0] : item.data["@type"];
    if (!type || !item.data["@context"]) issues.push("JSON-LD da @type/@context yoʻq");
    for (const field of REQUIRED_FIELDS[type] ?? []) {
      const value = item.data[field];
      if (value === undefined || value === null || (Array.isArray(value) && !value.length))
        issues.push(`JSON-LD ${type}: ${field} yoʻq`);
    }
    if (noindex && (type === "NewsArticle" || type === "Person"))
      issues.push(`noindex sahifada ${type} JSON-LD boʻlmaydi`);
  }
  return issues;
}

export async function checkPages(routes, localeMeta) {
  const validator = new HtmlValidate(
    new StaticConfigLoader({ extends: ["html-validate:standard"] }),
  );
  const hits = {
    status: [],
    lang: [],
    title: [],
    description: [],
    h1: [],
    canonical: [],
    hreflang: [],
    og: [],
    jsonld: [],
    validate: [],
  };
  const titles = new Map();
  const descriptions = new Map();
  const sink = {};
  const pages = new Map();
  await mapLimit(routes, 6, async (route) => {
    const url = BASE_URL + route.path;
    const { status, text } = await fetchText(url);
    if (status !== 200) {
      hits.status.push(`${route.path}: ${status}`);
      return;
    }
    pages.set(route.path, text);
    const lang = htmlLang(text);
    if (lang !== localeMeta[route.locale].htmlLang)
      hits.lang.push(`${route.path}: lang="${lang}", ${localeMeta[route.locale].htmlLang} kerak`);
    const t = title(text) ?? "";
    if (!t || t.length > TITLE_MAX)
      hits.title.push(`${route.path}: title ${t.length} belgi (≤ ${TITLE_MAX}): «${t}»`);
    const d = metaContent(text, "description") ?? "";
    if (!d || d.length > DESCRIPTION_MAX)
      hits.description.push(`${route.path}: description ${d.length} belgi (≤ ${DESCRIPTION_MAX})`);
    const tk = `${route.locale}|${t}`;
    if (titles.has(tk)) hits.title.push(`${route.path}: title ${titles.get(tk)} bilan bir xil`);
    else titles.set(tk, route.path);
    const dk = `${route.locale}|${d}`;
    if (descriptions.has(dk))
      hits.description.push(`${route.path}: description ${descriptions.get(dk)} bilan bir xil`);
    else descriptions.set(dk, route.path);
    const h1 = countTag(text, "h1");
    if (h1 !== 1) hits.h1.push(`${route.path}: ${h1} ta h1`);
    const all = links(text);
    const canonical = all.filter((l) => l.rel === "canonical").map((l) => pathOf(l.href));
    if (canonical.length !== 1 || canonical[0] !== route.path)
      hits.canonical.push(`${route.path}: canonical ${canonical.join(", ") || "yoʻq"}`);
    const alternates = all.filter((l) => l.rel === "alternate" && l.hreflang);
    const want = route.locale === "ozbekca" ? {} : expectedHreflang(route, routes, localeMeta);
    for (const [tag, href] of Object.entries(want))
      if (!alternates.some((a) => a.hreflang === tag && pathOf(a.href) === href))
        hits.hreflang.push(`${route.path}: hreflang ${tag} → ${href} yoʻq`);
    for (const a of alternates)
      if (want[a.hreflang] !== pathOf(a.href))
        hits.hreflang.push(`${route.path}: kutilmagan hreflang ${a.hreflang} → ${a.href}`);
    const og = await ogImage(text, sink);
    if (og) hits.og.push(`${route.path}: ${og}`);
    for (const issue of jsonLdIssues(text)) hits.jsonld.push(`${route.path}: ${issue}`);
    const report = await validator.validateString(text, route.path);
    for (const result of report.results)
      for (const m of result.messages)
        hits.validate.push(`${route.path}:${m.line}:${m.column}: ${m.message} (${m.ruleId})`);
  });
  log(`G4: ${pages.size} sahifa, ${sink.ogChecked ?? 0} OG rasm`);
  return {
    pages,
    checks: Object.entries(hits).map(([key, list]) =>
      summarize(
        `seo:${key}`,
        list,
        key === "og" ? `${sink.ogChecked ?? 0} rasm 1200×630` : undefined,
      ),
    ),
  };
}
