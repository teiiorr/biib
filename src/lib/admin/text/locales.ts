import type { Localized } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { latinToCyrillic, latinToReform } from "@/i18n/translit";

import { normalizeFor, normalizeUz } from "./normalize";

/** Oʻzbekchadan avtomatik oʻgiriladigan ikki til: kirill va 2026 imlosi. */
export type DerivedLocale = "oz" | "ozbekca";

export const DERIVED_LOCALES: readonly DerivedLocale[] = ["oz", "ozbekca"];

export function isDerived(locale: Locale): locale is DerivedLocale {
  return locale === "oz" || locale === "ozbekca";
}

export function emptyLocalized(): Localized {
  return { uz: "", oz: "", ozbekca: "", ru: "", en: "" };
}

/* Oʻgirish meʼyorlangan matndan: apostrof bilan yozilgan «o'» ham toʻgʻri «ў» boʻladi. */
export function deriveFromUz(locale: DerivedLocale, uz: string): string {
  const source = normalizeUz(uz);
  return locale === "oz" ? latinToCyrillic(source) : latinToReform(source);
}

/** Qiymat oʻzbekchadan oʻgirilgan holatidami («avto»); aks holda qoʻlda tahrirlangan. */
export function isAuto(value: Localized, locale: DerivedLocale): boolean {
  return value[locale] === deriveFromUz(locale, value.uz);
}

/** Oʻzbekcha oʻzgarganda: avto tillar yangidan oʻgiriladi, qoʻlda yozilgani tegilmaydi. */
export function withUz(previous: Localized, uz: string): Localized {
  const next = { ...previous, uz };
  for (const locale of DERIVED_LOCALES) {
    if (isAuto(previous, locale)) next[locale] = deriveFromUz(locale, uz);
  }
  return next;
}

/** Har til oʻz qoidasi bilan meʼyorlanadi; boʻsh kirill va 2026 qatori oʻzbekchadan toʻldiriladi. */
export function normalizeLocalized(value: Localized): Localized {
  const next = { ...value };
  for (const locale of Object.keys(value) as Locale[])
    next[locale] = normalizeFor(locale, value[locale]);
  for (const locale of DERIVED_LOCALES) {
    if (!next[locale] && next.uz) next[locale] = deriveFromUz(locale, next.uz);
  }
  return next;
}

/** Matn xatboshilarga: boʻsh qator chegarasi. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function fromParagraphs(paragraphs: readonly string[]): string {
  return paragraphs.join("\n\n");
}
