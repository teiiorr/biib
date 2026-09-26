"use client";

import { useState } from "react";

import type { Localized } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { normalizeFor } from "@/lib/admin/text/normalize";
import {
  deriveFromUz,
  isAuto,
  isDerived,
  withUz,
  type DerivedLocale,
} from "@/lib/admin/text/locales";

export interface LocaleEditing {
  /** Qoʻlda yozilgan qator ustidan oʻzbekcha oʻzgardimi (qayta oʻgirish taklifi). */
  readonly stale: Readonly<Record<DerivedLocale, boolean>>;
  readonly change: (locale: Locale, text: string) => void;
  /** Maydondan chiqqanda meʼyorlash (apostrof, qoʻshtirnoq, uch nuqta). */
  readonly tidy: (locale: Locale) => void;
  readonly retranslit: (locale: DerivedLocale) => void;
}

/**
 * Besh tilli qiymatni tahrirlash qoidalari (LocaleField va LocaleListField uchun bitta): oʻzbekcha
 * oʻzgarsa avto qatorlar qayta oʻgiriladi, qoʻlda yozilgani saqlanadi va belgilanadi.
 */
export function useLocaleEditing(
  value: Localized,
  onChange: (next: Localized) => void,
): LocaleEditing {
  const [stale, setStale] = useState<Readonly<Record<DerivedLocale, boolean>>>({
    oz: false,
    ozbekca: false,
  });

  function change(locale: Locale, text: string): void {
    if (locale === "uz") {
      setStale((s) => ({
        oz: s.oz || !isAuto(value, "oz"),
        ozbekca: s.ozbekca || !isAuto(value, "ozbekca"),
      }));
      onChange(withUz(value, text));
      return;
    }
    if (isDerived(locale)) setStale((s) => ({ ...s, [locale]: false }));
    onChange({ ...value, [locale]: text });
  }

  /* Yozish paytida emas, maydondan chiqqanda: boshqariladigan maydonda kursor sakramaydi. */
  function tidy(locale: Locale): void {
    const normalized = normalizeFor(locale, value[locale]);
    if (normalized === value[locale]) return;
    onChange(locale === "uz" ? withUz(value, normalized) : { ...value, [locale]: normalized });
  }

  function retranslit(locale: DerivedLocale): void {
    setStale((s) => ({ ...s, [locale]: false }));
    onChange({ ...value, [locale]: deriveFromUz(locale, value.uz) });
  }

  return { stale, change, tidy, retranslit };
}
