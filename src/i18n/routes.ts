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

/* Slug faqat ASCII: Telegram va pochtada %D1%8F… koʻrinishiga oʻtib ketmasin. Roʻyxat kontentda
   (select.ts), bu yerda faqat shakl tekshiriladi: yangi maqola kodga tegmasdan qoʻshiladi. */
export const NEWS_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NEWS_SLUG_MAX = 80;

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

/** Faqat shakl: tasodifiy skanerlar kontentga murojaat qilmasdan 404 oladi. */
export function isNewsSlug(value: string): boolean {
  // Yigʻishda metadata params boʻsh kelishi mumkin: undefined «undefined» matni boʻlib oʻtmasin.
  return typeof value === "string" && value.length <= NEWS_SLUG_MAX && NEWS_SLUG_RE.test(value);
}

/** Har bir sahifa uchun beshta tildagi yoʻl: til almashtirgich, alternates, sitemap. */
export function alternatesFor(key: PageKey, slug?: string): Record<Locale, string> {
  const out = {} as Record<Locale, string>;
  for (const locale of LOCALES) out[locale] = pathFor(locale, key, slug);
  return out;
}

/** ozbekca hreflang toʻplamiga kirmaydi, x-default esa uz sahifasini koʻrsatadi. */
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
  readonly slug?: string;
  readonly path: string;
}

/** Barcha sahifalar: (9 statik + har yangilik) × 5 til. Sluglar kontent nusxasidan beriladi. */
export function allRoutes(newsSlugs: readonly string[]): readonly RouteEntry[] {
  const out: RouteEntry[] = [];
  for (const locale of LOCALES) {
    out.push({ locale, key: "home", path: pathFor(locale, "home") });
    for (const key of SECTION_KEYS) {
      out.push({ locale, key, path: pathFor(locale, key) });
    }
    for (const slug of newsSlugs) {
      out.push({ locale, key: "newsItem", slug, path: pathFor(locale, "newsItem", slug) });
    }
  }
  return out;
}

export interface ResolvedPath {
  readonly locale: Locale;
  readonly key: PageKey;
  readonly slug?: string;
}

/** Brauzer yoʻlidan sahifa kalitini topadi: til menyusi va faol belgi uchun. */
export function resolvePath(pathname: string): ResolvedPath | null {
  const parts = pathname.split("/").filter(Boolean);
  const [first, second, third] = parts;
  if (!first || !(LOCALES as readonly string[]).includes(first)) return null;
  const locale = first as Locale;
  if (!second) return { locale, key: "home" };
  const key = resolveSection(locale, second);
  if (!key) return null;
  if (key === "news" && third) {
    return isNewsSlug(third) ? { locale, key: "newsItem", slug: third } : null;
  }
  if (third) return null;
  return { locale, key };
}
