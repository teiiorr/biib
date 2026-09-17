import { Manrope, Unbounded } from "next/font/google";

/**
 * Unbounded — sarlavhalar, meros ovozi. Manrope — matn.
 * İkkalasida ham latin, latin-ext, cyrillic va cyrillic-ext bor:
 * ʻ (U+02BB), ʼ (U+02BC) va ç ş ö ğ beş tilning hammasida çiqadi.
 */

export const unbounded = Unbounded({
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
