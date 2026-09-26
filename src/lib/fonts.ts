import { LOCALE_META, type Locale } from "@/i18n/locales";

/**
 * Manrope UZ va Unbounded UZ oʻz-oʻzidan xizmat qilinadi (public/fonts, scripts/fonts.mts): next/font til boʻyicha
 * preload qila olmaydi. Toʻplamlar unicode-range bilan boʻlingan, preload faqat shu tilga kerak
 * fayllar uchun.
 *
 * Har sahifa: Manrope ning shu tildagi asosiy toʻplami (matn) va Unbounded ning asosiy toʻplami
 * (sarlavhalar; oz dagi Қ Ғ Ҳ uchun cyrillic-ext preloadsiz, swap bilan).
 * Lotin: latin (ʻ ʼ shu toʻplamda); 2026 imlosi Ş Ğ uchun latin-ext ham.
 * Kirill: cyrillic + (oz: Қ Ғ Ҳ uchun cyrillic-ext; ru: raqam va brend uchun latin).
 * Qahramon toʻplami faqat bosh sahifada (heroFontPreload): jami ≤ 4 (§17).
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

/** Bosh sahifa qahramoni nomining til toʻplami (≈ 1,6 KB): boshqa sahifalarda kerak emas. */
export function heroFontPreload(locale: Locale): string {
  return `/fonts/hero-${locale}.woff2`;
}

/** Qahramon sarlavhasining til toʻplami: block — preload bilan keladi, zaxira shrift miltillamaydi. */
export function heroFontFace(locale: Locale): string {
  return `@font-face{font-family:"Unbounded Hero";font-weight:700;font-display:block;src:url(/fonts/hero-${locale}.woff2) format("woff2")}`;
}
