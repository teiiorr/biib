/**
 * Beş til. Kodlar — haqiqiy BCP-47 teglari, çunki ularni Intl,
 * <html lang> va hreflang öqiydi.
 *
 * Yangi lotin uçun uz-Latn-x-reform: x- xususiy quyi teg, Intl uni
 * uz-Latn ga tuşiradi va sanalar töğri çiqadi. Imlo farqi keyin
 * reformOrthography() bilan qöyiladi.
 */

export const LOCALES = ["uz-Latn", "uz-Cyrl", "uz-Latn-x-reform", "ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz-Latn";

/** Yangi imloli lotin — Intl çiqişini tözatiş kerak bölgan yagona til. */
export const REFORM_LOCALE: Locale = "uz-Latn-x-reform";

export interface LocaleMeta {
  readonly code: Locale;
  /** URL daki birinçi segment. routing.localePrefix bilan bir xil. */
  readonly prefix: string;
  /** Til özini qanday ataydi. */
  readonly nativeName: string;
  /** Menyudagi qisqa belgi. */
  readonly shortName: string;
  /** Yözuv turi — dropdown da tartiblaş uçun. */
  readonly script: "latin" | "cyrillic";
  readonly englishName: string;
  readonly dir: "ltr";
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  "uz-Latn": {
    code: "uz-Latn",
    prefix: "/uz",
    nativeName: "Oʻzbekcha",
    shortName: "UZ",
    script: "latin",
    englishName: "Uzbek (Latin)",
    dir: "ltr",
  },
  "uz-Cyrl": {
    code: "uz-Cyrl",
    prefix: "/oz",
    nativeName: "Ўзбекча",
    shortName: "ЎЗ",
    script: "cyrillic",
    englishName: "Uzbek (Cyrillic)",
    dir: "ltr",
  },
  "uz-Latn-x-reform": {
    code: "uz-Latn-x-reform",
    prefix: "/ozbekca",
    nativeName: "Özbekça",
    shortName: "ÖZ",
    script: "latin",
    englishName: "Uzbek (reformed Latin)",
    dir: "ltr",
  },
  ru: {
    code: "ru",
    prefix: "/ru",
    nativeName: "Русский",
    shortName: "RU",
    script: "cyrillic",
    englishName: "Russian",
    dir: "ltr",
  },
  en: {
    code: "en",
    prefix: "/en",
    nativeName: "English",
    shortName: "EN",
    script: "latin",
    englishName: "English",
    dir: "ltr",
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function localeMeta(locale: Locale): LocaleMeta {
  return LOCALE_META[locale];
}
