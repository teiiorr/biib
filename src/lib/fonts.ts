import { Nunito, Playpen_Sans } from "next/font/google";

import { LOCALE_META, type Locale } from "@/i18n/locales";

/**
 * Inter va Akt oʻz-oʻzidan xizmat qilinadi (public/fonts, scripts/fonts.mts): next/font til boʻyicha
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
 * Har sahifa: Inter (matn) va Akt (sarlavhalar) shu tilning asosiy toʻplami. Akt preloadsiz almashinuvda
 * uzun sarlavha va iqtibos qatorlari qayta oqib, CLS beradi (biz-haqimizda kompyuterda 0.081 edi).
 * Lotin tillari: Inter latin (ʻ ʼ shu toʻplamda) + Akt latin; 2026 imlosi Ş Ğ uchun Inter latin-ext ham.
 * Kirill: Inter cyrillic + (oz: Қ Ғ Ҳ uchun cyrillic-ext; ru: raqam va brend uchun latin) + Akt cyrillic.
 * Qahramon toʻplami faqat bosh sahifada (heroFontPreload): jami ≤ 4 (§17).
 */
export function fontPreloads(locale: Locale): readonly string[] {
  const meta = LOCALE_META[locale];
  if (meta.script === "cyrillic") {
    return [
      "/fonts/inter-cyrillic.woff2",
      locale === "oz" ? "/fonts/inter-cyrillic-ext.woff2" : "/fonts/inter-latin.woff2",
      "/fonts/akt-cyrillic.woff2",
    ];
  }
  if (meta.orthography === "2026") {
    return ["/fonts/inter-latin.woff2", "/fonts/inter-latin-ext.woff2", "/fonts/akt-latin.woff2"];
  }
  return ["/fonts/inter-latin.woff2", "/fonts/akt-latin.woff2"];
}

/** Bosh sahifa qahramoni nomining til toʻplami (≈ 1,6 KB): boshqa sahifalarda kerak emas. */
export function heroFontPreload(locale: Locale): string {
  return `/fonts/hero-${locale}.woff2`;
}

/** Qahramon sarlavhasining til toʻplami: block — preload bilan keladi, zaxira shrift miltillamaydi. */
export function heroFontFace(locale: Locale): string {
  return `@font-face{font-family:"Akt Hero";font-weight:700;font-display:block;src:url(/fonts/hero-${locale}.woff2) format("woff2")}`;
}
