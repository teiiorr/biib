import { Nunito, Playpen_Sans } from "next/font/google";

import { LOCALE_META, type Locale } from "@/i18n/locales";

/**
 * Inter va Playfair oʻz-oʻzidan xizmat qilinadi (public/fonts, scripts/fonts.mjs): next/font til boʻyicha
 * preload qila olmaydi (modul grafidagi har nusxa uchun yozadi). Toʻplamlar unicode-range bilan boʻlingan,
 * preload faqat shu tilga kerak fayllar uchun, sahifada ≤ 4 (§17).
 * Birlashma shriftlari next/font orqali, preloadsiz: faqat faol dizayn soʻraydi.
 */
const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-nunito",
  display: "swap",
  preload: false,
});
const playpen = Playpen_Sans({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-playpen",
  display: "swap",
  preload: false,
});

export const FONT_CLASS = [nunito, playpen].map((f) => f.variable).join(" ");

/**
 * Lotin tillari: Inter latin (ʻ ʼ shu toʻplamda) + qahramon toʻplami; 2026 imlosi Ö Ğ Ş Ç uchun latin-ext ham.
 * Kirill tillari: Inter cyrillic (+ Қ Ғ Ҳ uchun cyrillic-ext) + raqam va brend uchun latin + qahramon toʻplami.
 */
export function fontPreloads(locale: Locale): readonly string[] {
  const meta = LOCALE_META[locale];
  const hero = `/fonts/hero-${locale}.woff2`;
  if (meta.script === "cyrillic") {
    return [
      "/fonts/inter-cyrillic.woff2",
      locale === "oz" ? "/fonts/inter-cyrillic-ext.woff2" : "/fonts/inter-latin.woff2",
      hero,
    ];
  }
  if (meta.orthography === "2026") {
    return ["/fonts/inter-latin.woff2", "/fonts/inter-latin-ext.woff2", hero];
  }
  return ["/fonts/inter-latin.woff2", hero];
}

/** Qahramon sarlavhasining til toʻplami: block — preload bilan keladi, zaxira shrift miltillamaydi. */
export function heroFontFace(locale: Locale): string {
  return `@font-face{font-family:"Playfair Hero";font-weight:500;font-display:block;src:url(/fonts/hero-${locale}.woff2) format("woff2")}`;
}
