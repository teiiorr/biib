import { Inter, Nunito, Playfair, Playpen_Sans } from "next/font/google";
import type { Locale } from "@/i18n/locales";
import { LOCALE_META } from "@/i18n/locales";

/**
 * Har sahifada koʻpi bilan toʻrtta shrift fayli preload qilinadi (§17):
 * lotin tillari — latin + latin-ext (ʻ ʼ latin toʻplamida, Ö Ğ Ş Ç latin-ext da),
 * kirill tillari — cyrillic + cyrillic-ext (Ў cyrillic da, Қ Ғ Ҳ cyrillic-ext da).
 * Qolgan toʻplamlar zanjirdagi keyingi oila orqali kerak boʻlganda yuklanadi.
 */
const interLatin = Inter({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-inter-latin",
  display: "swap",
  preload: true,
});
const interCyrillic = Inter({
  subsets: ["cyrillic", "cyrillic-ext"],
  axes: ["opsz"],
  variable: "--font-inter-cyrillic",
  display: "swap",
  preload: false,
});
const interCyrillicFirst = Inter({
  subsets: ["cyrillic", "cyrillic-ext"],
  axes: ["opsz"],
  variable: "--font-inter-cyrillic",
  display: "swap",
  preload: true,
});
const interLatinLazy = Inter({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-inter-latin",
  display: "swap",
  preload: false,
});

const playfairLatin = Playfair({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--font-playfair-latin",
  display: "swap",
  preload: true,
});
const playfairCyrillic = Playfair({
  subsets: ["cyrillic", "cyrillic-ext"],
  axes: ["opsz", "wdth"],
  variable: "--font-playfair-cyrillic",
  display: "swap",
  preload: false,
});
const playfairCyrillicFirst = Playfair({
  subsets: ["cyrillic", "cyrillic-ext"],
  axes: ["opsz", "wdth"],
  variable: "--font-playfair-cyrillic",
  display: "swap",
  preload: true,
});
const playfairLatinLazy = Playfair({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--font-playfair-latin",
  display: "swap",
  preload: false,
});

/* Birlashma shriftlari faol dizayn tanlangandagina yuklanadi: preload yoʻq. */
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

export interface FontSetup {
  readonly className: string;
  /** globals.css dagi --font-ui / --font-display shu ikkitasini oʻqiydi. */
  readonly style: { readonly [key: `--${string}`]: string };
}

export function fontsFor(locale: Locale): FontSetup {
  const cyrillic = LOCALE_META[locale].script === "cyrillic";
  const inter = cyrillic ? [interCyrillicFirst, interLatinLazy] : [interLatin, interCyrillic];
  const playfair = cyrillic
    ? [playfairCyrillicFirst, playfairLatinLazy]
    : [playfairLatin, playfairCyrillic];
  const all = [...inter, ...playfair, nunito, playpen];
  return {
    className: all.map((f) => f.variable).join(" "),
    style: {
      "--font-inter": `var(--font-inter-${cyrillic ? "cyrillic" : "latin"}), var(--font-inter-${cyrillic ? "latin" : "cyrillic"})`,
      "--font-playfair": `var(--font-playfair-${cyrillic ? "cyrillic" : "latin"}), var(--font-playfair-${cyrillic ? "latin" : "cyrillic"})`,
    },
  };
}
