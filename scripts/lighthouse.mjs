// G7: Lighthouse 13 mobil va kompyuter, har sahifa turi, byudjetlar §17. Natija .verify/results/G7-lighthouse.json.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import lighthouse from "lighthouse";
import { throttling } from "lighthouse/core/config/constants.js";
import { launch } from "chrome-launcher";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";
const DESIGN = process.env.DESIGN === "birlashma" ? "birlashma" : "atlas";
const OUT = path.resolve(".lighthouse");
const RESULTS = path.resolve(".verify/results");
mkdirSync(OUT, { recursive: true });
mkdirSync(RESULTS, { recursive: true });

const PAGES = {
  home: "/uz",
  about: "/uz/biz-haqimizda",
  projects: "/uz/loyihalar",
  news: "/uz/yangiliklar",
  newsItem: "/uz/yangiliklar/upop-trend-yangi-mavsum",
  experts: "/uz/ekspertlar-kengashi",
  leadership: "/uz/rahbariyat",
  partners: "/uz/hamkorlar",
  contacts: "/uz/aloqa",
  privacy: "/uz/maxfiylik",
};
const BUDGET = {
  mobile: { performance: 90, lcp: 2000, cls: 0.05, tbt: 150 },
  desktop: { performance: 98, lcp: 2500, cls: 0.05, tbt: 150 },
};
/* ONLY=home,about — tez tekshiruv uchun sahifalar kesimi (toʻliq gate hammasini yuradi). */
const ONLY = (process.env.ONLY ?? "").split(",").filter(Boolean);
const PAGE_LIST = Object.entries(PAGES).filter(([key]) => !ONLY.length || ONLY.includes(key));

const checks = [];
const push = (id, ok, detail) => checks.push({ id, status: ok ? "pass" : "fail", detail });

const htmlCache = new Map();
async function fetchHtml(url) {
  if (!htmlCache.has(url)) htmlCache.set(url, await (await fetch(url)).text());
  return htmlCache.get(url);
}
async function initialScripts(url) {
  const html = await fetchHtml(url);
  return new Set(
    [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => new URL(m[1], url).pathname),
  );
}
async function isNoindex(url) {
  const html = await fetchHtml(url);
  return /<meta name="robots" content="[^"]*noindex/.test(html);
}
/* Lighthouse toifasi kabi: vaznli oʻrtacha, bitta audit chiqarib tashlangan holda. */
function scoreWithout(refs, audits, skipId) {
  let sum = 0;
  let weight = 0;
  for (const ref of refs) {
    if (ref.id === skipId || !ref.weight) continue;
    const score = audits[ref.id]?.score;
    if (score === null || score === undefined) continue;
    sum += score * ref.weight;
    weight += ref.weight;
  }
  return weight ? Math.round((sum / weight) * 100) : 100;
}

const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
try {
  for (const [name, route] of PAGE_LIST) {
    for (const form of ["mobile", "desktop"]) {
      const url = `${BASE_URL}${route}?dizayn=${DESIGN}`;
      const result = await lighthouse(url, {
        port: chrome.port,
        output: "html",
        logLevel: "error",
        formFactor: form,
        screenEmulation:
          form === "mobile"
            ? { mobile: true, width: 412, height: 915, deviceScaleFactor: 2.6, disabled: false }
            : { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
        /* formFactor tarmoq va CPU sekinlashuvini oʻzgartirmaydi: kompyuterga Lighthouse ning rasmiy
           desktop sozlamasi berilmasa, u telefon 4G va 4× CPU bilan oʻlchanadi. */
        throttling: form === "mobile" ? throttling.mobileSlow4G : throttling.desktopDense4G,
        throttlingMethod: "simulate",
        onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
      });
      if (!result) {
        push(`lh:${DESIGN}:${name}:${form}`, false, "Lighthouse natija bermadi");
        continue;
      }
      const lhr = result.lhr;
      writeFileSync(path.join(OUT, `${DESIGN}-${name}-${form}.html`), String(result.report));
      const cat = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
      const audit = (k) => lhr.audits[k]?.numericValue ?? Infinity;
      const b = BUDGET[form];
      const perf = cat("performance");
      const lcp = audit("largest-contentful-paint");
      const cls = audit("cumulative-layout-shift");
      const tbt = audit("total-blocking-time");
      const seo = cat("seo");
      const a11y = cat("accessibility");
      /* Birinchi yuklanish JS = boshlangʻich HTML dagi <script src> (Next «First Load JS»);
         boʻsh vaqtda keladigan dvigatel, badiiy va panel chunklari alohida hisoblanadi. */
      const initial = await initialScripts(url);
      const scripts = (lhr.audits["network-requests"]?.details?.items ?? []).filter(
        (i) => i.resourceType === "Script",
      );
      const jsBytes = scripts
        .filter((i) => initial.has(new URL(i.url).pathname))
        .reduce((s, i) => s + (i.transferSize ?? 0), 0);
      const lazyBytes = scripts
        .filter((i) => !initial.has(new URL(i.url).pathname))
        .reduce((s, i) => s + (i.transferSize ?? 0), 0);
      /* Tasdiqlanmagan mazmun noindex (§18.1): is-crawlable auditi ataylab yiqiladi, SEO qolgan auditlar boʻyicha. */
      const seoRefs = lhr.categories.seo?.auditRefs ?? [];
      const noindex = (lhr.audits["is-crawlable"]?.score ?? 1) < 1 && (await isNoindex(url));
      const seoScore = noindex ? scoreWithout(seoRefs, lhr.audits, "is-crawlable") : seo;
      const preloadFonts = (lhr.audits["network-requests"]?.details?.items ?? []).filter(
        (i) => i.resourceType === "Font" && i.priority === "High",
      ).length;
      const detail = `perf ${perf} (≥${b.performance}), LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}, TBT ${Math.round(tbt)} ms, SEO ${seoScore}${noindex ? " (noindex, is-crawlable hisobga olinmadi)" : ""}, A11y ${a11y}, JS ${Math.round(jsBytes / 1024)} KB + ${Math.round(lazyBytes / 1024)} KB kechiktirilgan`;
      push(`lh:${DESIGN}:${name}:${form}:performance`, perf >= b.performance, detail);
      push(`lh:${DESIGN}:${name}:${form}:lcp`, lcp <= b.lcp, `${Math.round(lcp)} ms`);
      push(`lh:${DESIGN}:${name}:${form}:cls`, cls <= b.cls, cls.toFixed(3));
      push(`lh:${DESIGN}:${name}:${form}:tbt`, tbt <= b.tbt, `${Math.round(tbt)} ms`);
      push(
        `lh:${DESIGN}:${name}:${form}:seo`,
        seoScore === 100,
        `${seoScore}${noindex ? " (noindex)" : ""}`,
      );
      push(`lh:${DESIGN}:${name}:${form}:a11y`, a11y === 100, String(a11y));
      push(
        `lh:${DESIGN}:${name}:${form}:first-load-js`,
        jsBytes <= 170 * 1024,
        `${Math.round(jsBytes / 1024)} KB (siqilgan) + ${Math.round(lazyBytes / 1024)} KB kechiktirilgan`,
      );
      push(
        `lh:${DESIGN}:${name}:${form}:font-preloads`,
        preloadFonts <= 4,
        `${preloadFonts} shrift`,
      );
    }
  }
} finally {
  await chrome.kill();
}

/* Qahramon video chunki (HeroVideo, data-chunk="hero-video") ≤ 10 KB gzip: faqat Atlasda, boʻsh vaqtda. */
const chunkDir = path.resolve(".next/static/chunks");
if (existsSync(chunkDir)) {
  const walk = (dir) =>
    readdirSync(dir).flatMap((f) =>
      statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)],
    );
  const heroChunks = walk(chunkDir).filter(
    (f) => f.endsWith(".js") && readFileSync(f, "utf8").includes("hero-video"),
  );
  for (const f of heroChunks) {
    const gz = gzipSync(readFileSync(f)).length;
    push(
      `hero-video-chunk:${path.basename(f)}`,
      gz <= 10 * 1024,
      `${Math.round(gz / 1024)} KB gzip`,
    );
  }
  if (!heroChunks.length)
    push("hero-video-chunk", DESIGN !== "atlas", "hero-video chunk topilmadi");
}
/* Posterlar (LCP rasmi) ≤ 120 KB AVIF (§17). */
for (const poster of ["hero-d-poster.avif", "hero-m-poster.avif"]) {
  const file = path.resolve("public/media", poster);
  const size = existsSync(file) ? statSync(file).size : Infinity;
  push(`hero-poster:${poster}`, size <= 120 * 1024, `${Math.round(size / 1024)} KB`);
}

const status = checks.some((c) => c.status === "fail") ? "fail" : "pass";
writeFileSync(
  path.join(RESULTS, "G7-lighthouse.json"),
  JSON.stringify({ gate: "G7", status, generatedAt: new Date().toISOString(), checks }, null, 2),
);
console.log(
  `lighthouse ${DESIGN}: ${status} (${checks.filter((c) => c.status === "fail").length} xato)`,
);
process.exit(status === "pass" ? 0 : 1);
