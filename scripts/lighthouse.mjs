// G7: Lighthouse 13 mobil va kompyuter, har sahifa turi, byudjetlar §17. Natija .verify/results/G7-lighthouse.json.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import lighthouse from "lighthouse";
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
const checks = [];
const push = (id, ok, detail) => checks.push({ id, status: ok ? "pass" : "fail", detail });

const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"] });
try {
  for (const [name, route] of Object.entries(PAGES)) {
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
      const scripts = (lhr.audits["network-requests"]?.details?.items ?? []).filter(
        (i) => i.resourceType === "Script",
      );
      const jsBytes = scripts.reduce((s, i) => s + (i.transferSize ?? 0), 0);
      const preloadFonts = (lhr.audits["network-requests"]?.details?.items ?? []).filter(
        (i) => i.resourceType === "Font" && i.priority === "High",
      ).length;
      const detail = `perf ${perf} (≥${b.performance}), LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}, TBT ${Math.round(tbt)} ms, SEO ${seo}, A11y ${a11y}, JS ${Math.round(jsBytes / 1024)} KB`;
      push(`lh:${DESIGN}:${name}:${form}:performance`, perf >= b.performance, detail);
      push(`lh:${DESIGN}:${name}:${form}:lcp`, lcp <= b.lcp, `${Math.round(lcp)} ms`);
      push(`lh:${DESIGN}:${name}:${form}:cls`, cls <= b.cls, cls.toFixed(3));
      push(`lh:${DESIGN}:${name}:${form}:tbt`, tbt <= b.tbt, `${Math.round(tbt)} ms`);
      push(`lh:${DESIGN}:${name}:${form}:seo`, seo === 100, String(seo));
      push(`lh:${DESIGN}:${name}:${form}:a11y`, a11y === 100, String(a11y));
      push(
        `lh:${DESIGN}:${name}:${form}:first-load-js`,
        jsBytes <= 170 * 1024,
        `${Math.round(jsBytes / 1024)} KB (siqilgan)`,
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

/* Shader chunk: yigʻilgan fayllar ichida uSeed uniformi bor chunk ≤ 25 KB gzip. */
const chunkDir = path.resolve(".next/static/chunks");
if (existsSync(chunkDir)) {
  const walk = (dir) =>
    readdirSync(dir).flatMap((f) =>
      statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)],
    );
  const shader = walk(chunkDir).filter(
    (f) => f.endsWith(".js") && readFileSync(f, "utf8").includes("uSeed"),
  );
  for (const f of shader) {
    const gz = gzipSync(readFileSync(f)).length;
    push(`shader-chunk:${path.basename(f)}`, gz <= 25 * 1024, `${Math.round(gz / 1024)} KB gzip`);
  }
  if (!shader.length) push("shader-chunk", DESIGN !== "atlas", "shader chunk topilmadi");
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
