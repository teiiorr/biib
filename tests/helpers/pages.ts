import { NEWS_SLUGS, PAGE_KEYS, pathFor, type Locale } from "./routes";

/** 11 sahifa turi: 10 shablon + lokal 404. */
export const PAGE_TYPES = [...PAGE_KEYS, "notFound"] as const;
export type PageType = (typeof PAGE_TYPES)[number];

/** Marshrut xaritasida yoʻq segment: har tilda lokal 404 ni ochadi. */
export const MISSING_SEGMENT = "yoq-sahifa";
export const UNKNOWN_LOCALE = "xx";

export function pagePath(locale: Locale, type: PageType): string {
  if (type === "notFound") return `${pathFor(locale, "home")}/${MISSING_SEGMENT}`;
  if (type === "newsItem") return pathFor(locale, "newsItem", NEWS_SLUGS[0]);
  return pathFor(locale, type);
}

/** Fayl nomlari uchun: "/uz/yangiliklar/x" → "uz_yangiliklar_x". */
export function routeId(path: string): string {
  const id = path.replace(/^\/+/, "").replace(/\/+/g, "_");
  return id || "root";
}
