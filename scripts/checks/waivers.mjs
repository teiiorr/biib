import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, readJson } from "./util.mjs";

/* Byudjet, qulaylik, kontrast, toshib chiqish va imlo uchun istisno boʻlmaydi (§21.2). */
const FORBIDDEN =
  /budget|contrast|overflow|orthograph|apostrophe|glyph|language|a11y|axe|accessib|target|lighthouse|perf|lcp|cls|tbt|inp|\bG3\b|\bG6\b|\bG7\b/i;
const FIELDS = ["check", "browser", "evidence", "fallback"];

export function loadWaivers() {
  const file = path.join(ROOT, "docs/qa/waivers.json");
  if (!existsSync(file)) return { waivers: [], errors: [] };
  const raw = readJson("docs/qa/waivers.json", null);
  if (!Array.isArray(raw)) return { waivers: [], errors: ["docs/qa/waivers.json massiv emas"] };
  const waivers = [];
  const errors = [];
  raw.forEach((entry, i) => {
    const missing = FIELDS.filter((f) => typeof entry?.[f] !== "string" || !entry[f].trim());
    if (missing.length) {
      errors.push(`waivers.json[${i}]: ${missing.join(", ")} maydoni yoʻq`);
      return;
    }
    if (FORBIDDEN.test(entry.check)) {
      errors.push(
        `waivers.json[${i}]: «${entry.check}» uchun istisno mumkin emas (byudjet, qulaylik, kontrast, toshish, imlo)`,
      );
      return;
    }
    waivers.push(entry);
  });
  return { waivers, errors };
}

function matches(waiver, check) {
  const id = check.id;
  const target = waiver.check;
  const idMatch =
    id === target ||
    id.startsWith(target + ":") ||
    id.includes(`:${target}`) ||
    (target.endsWith("*") && id.startsWith(target.slice(0, -1)));
  if (!idMatch) return false;
  const browser = waiver.browser.toLowerCase();
  if (browser === "*" || browser === "all") return true;
  const haystack = `${id} ${check.browser ?? ""} ${check.detail ?? ""}`.toLowerCase();
  return haystack.includes(browser);
}

/** Faqat muvaffaqiyatsiz tekshiruv istisno qilinadi; qaysi istisno ishlatilgani qaytariladi. */
export function applyWaivers(checks, waivers) {
  const used = [];
  const out = checks.map((check) => {
    if (check.status !== "fail") return check;
    const waiver = waivers.find((w) => matches(w, check));
    if (!waiver) return check;
    used.push({ ...waiver, id: check.id });
    return {
      ...check,
      status: "waived",
      detail:
        `${check.detail ?? ""}\nistisno: ${waiver.evidence}; zaxira: ${waiver.fallback}`.trim(),
    };
  });
  return { checks: out, used };
}
