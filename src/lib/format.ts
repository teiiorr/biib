import { REFORM_LOCALE, type Locale } from "@/i18n/locales";
import { reformOrthography } from "@/i18n/orthography";

type DateStyle = "long" | "short" | "numeric" | "dayMonth";

const OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { day: "numeric", month: "long", year: "numeric" },
  short: { day: "numeric", month: "short", year: "numeric" },
  numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
  dayMonth: { day: "numeric", month: "long" },
};

/**
 * Sanani til qoidasi böyiça yozadi. Yangi lotin uçun CLDR çiqişi
 * eski imloda keladi, şuning uçun ustidan reformOrthography() ötadi.
 */
export function formatDate(iso: string, locale: Locale, style: DateStyle = "long"): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    ...OPTIONS[style],
    timeZone: "Asia/Tashkent",
  }).format(new Date(iso));

  return locale === REFORM_LOCALE ? reformOrthography(formatted) : formatted;
}

/** <time datetime="..."> uçun. Til bilan bağliq emas. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
