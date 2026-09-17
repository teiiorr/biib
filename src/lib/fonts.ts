import { Inter } from "next/font/google";

/**
 * Apple qurilmalarida SF Pro tizimdan keladi (globals.css dagi font-sans),
 * qolgan hamma joyda — Inter. Beş til uçun kerakli quyi töplamlar:
 * latin da ʻ (U+02BB) va ʼ (U+02BC), latin-ext da ç ş ö ğ,
 * cyrillic va cyrillic-ext da özbek kirili hamda rus tili.
 */
export const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
  display: "swap",
});
