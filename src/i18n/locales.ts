export const LOCALES = ["uz", "oz", "ozbekca", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";

export interface LocaleMeta {
  readonly code: Locale;
  /** `<html lang>` qiymati. */
  readonly htmlLang: "uz-Latn" | "uz-Cyrl" | "ru" | "en";
  /** Intl uchun BCP-47 tegi. 2026 imlosi ham uz-Latn orqali formatlanadi. */
  readonly intl: "uz-Latn" | "uz-Cyrl" | "ru" | "en";
  /** hreflang: 2026 imlosi uchun alohida kod yoʻq, shu sabab null (6.5). */
  readonly hreflang: "uz-Latn" | "uz-Cyrl" | "ru" | "en" | null;
  readonly nativeName: string;
  readonly shortName: string;
  readonly script: "latin" | "cyrillic";
  readonly orthography: "current" | "2026" | null;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  uz: {
    code: "uz",
    htmlLang: "uz-Latn",
    intl: "uz-Latn",
    hreflang: "uz-Latn",
    nativeName: "Oʻzbekcha",
    shortName: "UZ",
    script: "latin",
    orthography: "current",
  },
  oz: {
    code: "oz",
    htmlLang: "uz-Cyrl",
    intl: "uz-Cyrl",
    hreflang: "uz-Cyrl",
    nativeName: "Ўзбекча",
    shortName: "ЎЗ",
    script: "cyrillic",
    orthography: null,
  },
  ozbekca: {
    code: "ozbekca",
    htmlLang: "uz-Latn",
    intl: "uz-Latn",
    hreflang: null,
    nativeName: "Özbekça",
    shortName: "ÖZ",
    script: "latin",
    orthography: "2026",
  },
  ru: {
    code: "ru",
    htmlLang: "ru",
    intl: "ru",
    hreflang: "ru",
    nativeName: "Русский",
    shortName: "RU",
    script: "cyrillic",
    orthography: null,
  },
  en: {
    code: "en",
    htmlLang: "en",
    intl: "en",
    hreflang: "en",
    nativeName: "English",
    shortName: "EN",
    script: "latin",
    orthography: null,
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Uchta oʻzbek varianti bitta til: slug va tarjima manbai umumiy. */
export function isUzbek(locale: Locale): boolean {
  return locale === "uz" || locale === "oz" || locale === "ozbekca";
}
