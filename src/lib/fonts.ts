import { LOCALE_META, type Locale } from "@/i18n/locales";

/**
 * Shriftlar oʻzimizda turadi (public/fonts, scripts/fonts.mts), chunki next/font til boʻyicha preload
 * qila olmaydi. Lotin: latin, 2026 imlosida Ş Ğ uchun latin-ext ham. Kirill: cyrillic, ru uchun raqam
 * va brend sababli latin, oz uchun Қ Ғ Ҳ sababli Manrope cyrillic-ext (Unbounded shriftiniki preloadsiz,
 * swap bilan). Qahramon toʻplami faqat bosh sahifada, jami 4 tadan oshmaydi.
 */
export function fontPreloads(locale: Locale): readonly string[] {
  const meta = LOCALE_META[locale];
  if (meta.script === "cyrillic") {
    return [
      "/fonts/manrope-cyrillic.woff2",
      locale === "oz" ? "/fonts/manrope-cyrillic-ext.woff2" : "/fonts/manrope-latin.woff2",
      "/fonts/unbounded-cyrillic.woff2",
    ];
  }
  if (meta.orthography === "2026") {
    return [
      "/fonts/manrope-latin.woff2",
      "/fonts/manrope-latin-ext.woff2",
      "/fonts/unbounded-latin.woff2",
    ];
  }
  return ["/fonts/manrope-latin.woff2", "/fonts/unbounded-latin.woff2"];
}

/** Bosh sahifa qahramoni nomining til toʻplami (≈ 1,6 KB), boshqa sahifalarda kerak emas. */
export function heroFontPreload(locale: Locale): string {
  return `/fonts/hero-${locale}.woff2`;
}

/** font-display: block, chunki fayl preload bilan keladi va zaxira shrift miltillamasligi kerak. */
export function heroFontFace(locale: Locale): string {
  return `@font-face{font-family:"Unbounded Hero";font-weight:700;font-display:block;src:url(/fonts/hero-${locale}.woff2) format("woff2")}`;
}
