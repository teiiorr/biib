import { LOCALES, LOCALE_META, type Locale } from "./locales";

export const PAGE_KEYS = [
  "home",
  "about",
  "projects",
  "news",
  "newsItem",
  "experts",
  "leadership",
  "partners",
  "contacts",
  "privacy",
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export type SectionKey = Exclude<PageKey, "home" | "newsItem">;

/** Yangiliklar sluglari faqat ASCII: Telegram va pochtada %D1%8F… boʻlib qolmasligi uchun. */
export const NEWS_SLUGS = [
  "upop-trend-yangi-mavsum",
  "rangli-olam-korgazmasi",
  "sahna-bolalari-yangi-studiyalar",
  "ustozlar-uchun-seminar",
  "ertak-ustaxonasi-birinchi-multfilmlar",
] as const;
export type NewsSlug = (typeof NEWS_SLUGS)[number];

type SegmentMap = Record<"uz" | "ru" | "en", string>;

const SEGMENTS: Record<SectionKey | "news", SegmentMap> = {
  about: { uz: "biz-haqimizda", ru: "o-nas", en: "about" },
  projects: { uz: "loyihalar", ru: "proekty", en: "projects" },
  news: { uz: "yangiliklar", ru: "novosti", en: "news" },
  experts: { uz: "ekspertlar-kengashi", ru: "ekspertnyy-sovet", en: "expert-council" },
  leadership: { uz: "rahbariyat", ru: "rukovodstvo", en: "leadership" },
  partners: { uz: "hamkorlar", ru: "partnery", en: "partners" },
  contacts: { uz: "aloqa", ru: "kontakty", en: "contacts" },
  privacy: { uz: "maxfiylik", ru: "konfidentsialnost", en: "privacy" },
};

export const SECTION_KEYS = Object.keys(SEGMENTS) as readonly (SectionKey | "news")[];

function segmentLocale(locale: Locale): keyof SegmentMap {
  if (locale === "ru" || locale === "en") return locale;
  return "uz";
}

export function sectionSegment(locale: Locale, key: SectionKey | "news"): string {
  return SEGMENTS[key][segmentLocale(locale)];
}

export function localePrefix(locale: Locale): string {
  return `/${locale}`;
}

export function pathFor(locale: Locale, key: PageKey, slug?: string): string {
  const prefix = localePrefix(locale);
  if (key === "home") return prefix;
  if (key === "newsItem") {
    if (!slug) throw new Error("newsItem uchun slug kerak");
    return `${prefix}/${sectionSegment(locale, "news")}/${slug}`;
  }
  return `${prefix}/${sectionSegment(locale, key)}`;
}

/** URL segmentidan sahifa kalitini topadi; boshqa tilning segmenti ham 404. */
export function resolveSection(locale: Locale, segment: string): SectionKey | "news" | null {
  for (const key of SECTION_KEYS) {
    if (sectionSegment(locale, key) === segment) return key;
  }
  return null;
}

export function isNewsSlug(value: string): value is NewsSlug {
  return (NEWS_SLUGS as readonly string[]).includes(value);
}

/** Har bir sahifa uchun beshta tildagi yoʻl: til almashtirgich, alternates, sitemap. */
export function alternatesFor(key: PageKey, slug?: string): Record<Locale, string> {
  const out = {} as Record<Locale, string>;
  for (const locale of LOCALES) out[locale] = pathFor(locale, key, slug);
  return out;
}

/** hreflang klasteri: ozbekca chiqarib tashlanadi (6.5), x-default uz ga. */
export function hreflangFor(key: PageKey, slug?: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const tag = LOCALE_META[locale].hreflang;
    if (tag) out[tag] = pathFor(locale, key, slug);
  }
  out["x-default"] = pathFor("uz", key, slug);
  return out;
}

export interface RouteEntry {
  readonly locale: Locale;
  readonly key: PageKey;
  readonly slug?: NewsSlug;
  readonly path: string;
}

/** Barcha 70 sahifa: 9 statik × 5 til + 5 yangilik × 5 til. */
export function allRoutes(): readonly RouteEntry[] {
  const out: RouteEntry[] = [];
  for (const locale of LOCALES) {
    out.push({ locale, key: "home", path: pathFor(locale, "home") });
    for (const key of SECTION_KEYS) {
      out.push({ locale, key, path: pathFor(locale, key) });
    }
    for (const slug of NEWS_SLUGS) {
      out.push({ locale, key: "newsItem", slug, path: pathFor(locale, "newsItem", slug) });
    }
  }
  return out;
}

export function breadcrumbKeys(key: PageKey): readonly PageKey[] {
  if (key === "home") return ["home"];
  if (key === "newsItem") return ["home", "news", "newsItem"];
  return ["home", key];
}
