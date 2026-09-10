import { Nunito, Rubik } from "next/font/google";

/**
 * Ikki oila, beş til. Rubik va Nunito da cyrillic va cyrillic-ext
 * quyi töplamlari bor — Baloo 2 va Fredoka da yöq, şuning uçun ular
 * olinmadi: /ru va /oz da sarlavhalar tizim şriftiga tuşib ketardi.
 * latin quyi töplami ʻ (U+02BB) va ʼ (U+02BC) ni öz içiga oladi,
 * latin-ext esa ç ş ö ğ ni.
 */

export const rubik = Rubik({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

export const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});
