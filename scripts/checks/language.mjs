import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { checkFonts } from "../glyph-check.mjs";
import {
  LOREM,
  NON_ENGLISH,
  NATIVE_NAMES,
  REFORM_LETTERS,
  ROMANIAN_LETTERS,
  UZBEK,
  apostropheIssues,
  englishLeaks,
  latinInCyrillic,
  quoteIssues,
} from "./language-rules.mjs";
import { ROOT, fail, pass, runHelper } from "./util.mjs";

function flatten(value, at, locale, out) {
  if (typeof value === "string") out.push({ locale, path: at, value });
  else if (Array.isArray(value)) value.forEach((v, i) => flatten(v, `${at}[${i}]`, locale, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) flatten(v, at ? `${at}.${k}` : k, locale, out);
}

/** Baholangan satrni manba faylida topib fayl:qator qaytaradi (topilmasa mantiqiy yoʻl). */
function makeLocator() {
  const cache = new Map();
  const load = (dir) => {
    if (cache.has(dir)) return cache.get(dir);
    const files = [];
    const visit = (d) => {
      if (!existsSync(d)) return;
      for (const entry of readdirSync(d)) {
        const full = path.join(d, entry);
        if (statSync(full).isDirectory()) visit(full);
        else if (/\.tsx?$/.test(entry))
          files.push({
            file: path.relative(ROOT, full),
            lines: readFileSync(full, "utf8").split("\n"),
          });
      }
    };
    visit(path.join(ROOT, dir));
    cache.set(dir, files);
    return files;
  };
  return (entry) => {
    const dir =
      entry.source === "content" ? "src/content" : `src/i18n/dictionaries/${entry.locale}`;
    const needle = '"' + entry.value.split(/["\\]/)[0].slice(0, 40);
    if (needle.length >= 4)
      for (const { file, lines } of load(dir)) {
        const index = lines.findIndex((line) => line.includes(needle));
        if (index >= 0) return `${file}:${index + 1}`;
      }
    return `${entry.source}:${entry.locale}:${entry.path}`;
  };
}

function summarize(id, hits) {
  if (!hits.length) return pass(id);
  return fail(
    id,
    hits.slice(0, 12).join("\n") + (hits.length > 12 ? `\n… jami ${hits.length}` : ""),
  );
}

export function scanStrings(data) {
  const keep = new Set((data.keepWords ?? []).map((w) => w.toLowerCase()));
  const entries = [];
  for (const [locale, tree] of Object.entries(data.dictionaries)) {
    const out = [];
    flatten(tree, "", locale, out);
    for (const e of out) entries.push({ ...e, source: "dictionary" });
  }
  for (const e of data.content) entries.push({ ...e, source: "content" });
  const locate = makeLocator();
  /* Texnik qiymatlar (id, slug, href, src, icon) matn emas. */
  const technical = /(?:^|\.)(?:id|slug|href|src|key|icon|url|anchor)(?:\[\d+\])?$/;
  const hits = {
    apostrophe: [],
    reform: [],
    ozLatin: [],
    english: [],
    lorem: [],
    quotes: [],
    romanian: [],
  };
  for (const entry of entries) {
    if (technical.test(entry.path)) continue;
    const where = () => `${locate(entry)} [${entry.locale} ${entry.path}]`;
    const { locale, value } = entry;
    if (UZBEK.has(locale))
      for (const issue of apostropheIssues(locale, value))
        hits.apostrophe.push(`${where()}: ${issue}: «${value.slice(0, 60)}»`);
    if (locale !== "ozbekca") {
      const cleaned = [...NATIVE_NAMES].reduce((text, name) => text.split(name).join(" "), value);
      if (REFORM_LETTERS.test(cleaned))
        hits.reform.push(
          `${where()}: 2026 harflari (Ö Ğ Ş Ç) faqat ozbekca da: «${value.slice(0, 60)}»`,
        );
    }
    if (ROMANIAN_LETTERS.test(value))
      hits.romanian.push(`${where()}: rumincha Ș/Ț emas, sedilli Ş/Ç kerak`);
    if (locale === "oz") {
      const latin = latinInCyrillic(value, keep);
      if (latin.length) hits.ozLatin.push(`${where()}: lotin soʻzlar: ${latin.join(", ")}`);
    }
    if (NON_ENGLISH.has(locale)) {
      const leaks = englishLeaks(value, keep);
      if (leaks.length) hits.english.push(`${where()}: inglizcha soʻz: ${leaks.join(", ")}`);
    }
    if (LOREM.test(value)) hits.lorem.push(`${where()}: lorem`);
    for (const issue of quoteIssues(locale, value))
      hits.quotes.push(`${where()}: ${issue}: «${value.slice(0, 60)}»`);
  }
  return [
    summarize("language:apostrophe", hits.apostrophe),
    summarize("language:reform-letters", hits.reform),
    summarize("language:romanian-letters", hits.romanian),
    summarize("language:oz-latin", hits.ozLatin),
    summarize("language:english-leak", hits.english),
    summarize("language:lorem", hits.lorem),
    summarize("language:quotes", hits.quotes),
    pass("language:strings", `${entries.length} satr tekshirildi`),
  ];
}

export function checkNamespaces(namespaces) {
  const base = namespaces.uz ?? [];
  const missing = [];
  for (const [locale, files] of Object.entries(namespaces)) {
    for (const file of base)
      if (!files.includes(file)) missing.push(`src/i18n/dictionaries/${locale}/${file} yoʻq`);
    for (const file of files)
      if (!base.includes(file)) missing.push(`src/i18n/dictionaries/${locale}/${file} uz da yoʻq`);
  }
  return summarize("language:namespaces", missing);
}

export async function runLanguage() {
  let data;
  try {
    data = runHelper("strings.mts");
  } catch (error) {
    return [fail("language:strings", error instanceof Error ? error.message : String(error))];
  }
  return [...scanStrings(data), checkNamespaces(data.namespaces), ...checkFonts()];
}
