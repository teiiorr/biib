import { readdirSync } from "node:fs";
import path from "node:path";
import { bundledSnapshot } from "../../src/content/bundled";
import {
  selectArtworks,
  selectContacts,
  selectExperts,
  selectLeadership,
  selectMilestones,
  selectNews,
  selectPartners,
  selectProjects,
} from "../../src/content/select";
import { getDictionary } from "../../src/i18n/dictionaries/index";
import { LOCALES } from "../../src/i18n/locales";
import { KEEP_WORDS } from "../../src/i18n/translit-exceptions";

/* Til tekshiruvi uchun barcha satrlar: lugʻatlar toʻliq, kontent Localized maydonlar boʻyicha. */
const ROOT = path.resolve(import.meta.dirname, "../..");
const LOCALE_SET = new Set<string>(LOCALES);

interface Entry {
  readonly path: string;
  readonly locale: string;
  readonly value: string;
}

function isLocalized(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return LOCALES.every((locale) => keys.includes(locale));
}

function walk(value: unknown, at: string, out: Entry[]): void {
  if (isLocalized(value)) {
    for (const [locale, item] of Object.entries(value)) {
      if (!LOCALE_SET.has(locale)) continue;
      if (typeof item === "string") out.push({ path: at, locale, value: item });
      else if (Array.isArray(item))
        item.forEach((line, i) => {
          if (typeof line === "string") out.push({ path: `${at}[${i}]`, locale, value: line });
        });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${at}[${i}]`, out));
    return;
  }
  if (value && typeof value === "object")
    for (const [key, item] of Object.entries(value)) walk(item, at ? `${at}.${key}` : key, out);
}

const content: Entry[] = [];
const snapshot = bundledSnapshot();
walk(
  {
    projects: selectProjects(snapshot),
    news: selectNews(snapshot),
    experts: selectExperts(snapshot),
    leadership: selectLeadership(snapshot),
    partners: selectPartners(snapshot),
    contacts: selectContacts(snapshot),
    milestones: selectMilestones(snapshot),
    artworks: selectArtworks(snapshot),
    /* Paneldan yozilgan lugʻat matnlari ham xuddi shu qoidalar bilan tekshiriladi. */
    texts: snapshot.texts,
  },
  "",
  content,
);

const dictionaries: Record<string, unknown> = {};
const namespaces: Record<string, readonly string[]> = {};
for (const locale of LOCALES) {
  dictionaries[locale] = getDictionary(locale);
  namespaces[locale] = readdirSync(path.join(ROOT, "src/i18n/dictionaries", locale))
    .filter((file) => file.endsWith(".ts") && file !== "index.ts" && file !== "overrides.ts")
    .sort();
}

process.stdout.write(
  JSON.stringify({
    dictionaries,
    namespaces,
    content,
    keepWords: [...KEEP_WORDS, ...snapshot.allowWords],
  }),
);
