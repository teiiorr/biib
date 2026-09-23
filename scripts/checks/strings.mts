import { readdirSync } from "node:fs";
import path from "node:path";
import {
  getArtworks,
  getContacts,
  getExperts,
  getLeadership,
  getMilestones,
  getNews,
  getPartners,
  getProjects,
} from "../../src/content/index";
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
walk(
  {
    projects: getProjects(),
    news: getNews(),
    experts: getExperts(),
    leadership: getLeadership(),
    partners: getPartners(),
    contacts: getContacts(),
    milestones: getMilestones(),
    artworks: getArtworks(),
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
  JSON.stringify({ dictionaries, namespaces, content, keepWords: [...KEEP_WORDS] }),
);
