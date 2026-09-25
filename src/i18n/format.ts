import { LOCALE_META, type Locale } from "./locales";
import { latinToReform } from "./translit/latin-to-reform";

const NBSP = " ";

/** Sana: «2026-yil 24-sentabr», «24 сентября 2026 г.», «24 September 2026». */
export function formatDate(locale: Locale, iso: string): string {
  const date = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  const intl = LOCALE_META[locale].intl;
  if (intl === "uz-Latn" || intl === "uz-Cyrl") {
    const day = date.getUTCDate();
    // ICU mustaqil shaklda lotin oy nomini bosh harf bilan beradi («Sentabr»), imlo esa kichik harf talab qiladi.
    const month = new Intl.DateTimeFormat(intl, { month: "long", timeZone: "UTC" })
      .format(date)
      .toLocaleLowerCase(intl);
    const year = date.getUTCFullYear();
    const text =
      intl === "uz-Latn"
        ? `${year}-yil ${day}-${month}`
        : `${year}${NBSP}йил ${day}${NBSP}${month}`;
    return locale === "ozbekca" ? latinToReform(text) : text;
  }
  return new Intl.DateTimeFormat(intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Oʻqish vaqti: 180 soʻz/daqiqa, kamida 1 daqiqa. */
export function readingMinutes(paragraphs: readonly string[]): number {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
