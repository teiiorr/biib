import { Cormorant, Manrope } from "next/font/google";

/**
 * Cormorant — sarlavhalar: nozik kontrastli, qölyozma-luks serif;
 * Registon ruhi + jurnal darajasi. cyrillic-ext bor — ҳ қ ғ ў
 * beş tilning hammasida öz şriftida çiqadi (zaxira şrift kerak emas).
 * Manrope — matn va UI.
 */

export const cormorant = Cormorant({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
