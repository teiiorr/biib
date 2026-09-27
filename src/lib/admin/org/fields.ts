import type { ContentStatus, Localized } from "@/content/types";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";

import { ORG_COPY } from "../copy-org";
import { normalizeLocalized } from "../text/locales";

const E = ORG_COPY.errors;
const NBSP = "\u00a0";

/** Tekshiruv davomida toʻplanadigan xatolar: maydon yoʻli → matn. */
export type ErrorBag = Record<string, string>;

export interface DetailDraft<T> {
  readonly value: T;
  readonly status: ContentStatus;
}

/** Har til uchun bitta qiymat: besh tilli obyekt tur tekshiruvi bilan quriladi. */
export function perLocale<T>(pick: (locale: Locale) => T): Localized<T> {
  return {
    uz: pick("uz"),
    oz: pick("oz"),
    ozbekca: pick("ozbekca"),
    ru: pick("ru"),
    en: pick("en"),
  };
}

export function isFilled(value: Localized): boolean {
  return LOCALES.some((locale) => value[locale].trim() !== "");
}

/** Beshala til majburiy (bazada l10n_text): meʼyorlangan qiymat qaytadi. */
export function requiredLocalized(errors: ErrorBag, path: string, value: Localized): Localized {
  const next = normalizeLocalized(value);
  for (const locale of LOCALES) {
    if (!next[locale])
      errors[`${path}.${locale}`] = fill(E.required, { lang: LOCALE_META[locale].nativeName });
  }
  return next;
}

/**
 * Ixtiyoriy besh tilli qiymat: hammasi boʻsh boʻlsa null, bittasi yozilsa hammasi kerak. Tasdiqlangan
 * holatda boʻsh qoldirib boʻlmaydi (saytda tasdiqlangan boʻsh joy chiqmasin).
 */
export function optionalLocalized(
  errors: ErrorBag,
  path: string,
  value: Localized,
  status: ContentStatus = "pending",
): Localized | null {
  if (!isFilled(value)) {
    if (status === "confirmed") errors[`${path}.uz`] = E.confirmedEmpty;
    return null;
  }
  return requiredLocalized(errors, path, value);
}

/**
 * Faqat https havola; sxemasiz yozilsa https qoʻshiladi. Yozilgani oʻzgarmay qaytadi (URL.href oxiriga
 * «/» qoʻshardi): saqlash tegilmagan havolani oʻzgartirmasin.
 */
export function httpsUrl(raw: string): string | null {
  const text = raw.trim();
  if (!text || /\s/.test(text)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "https:" && url.hostname.includes(".") ? withScheme : null;
  } catch {
    return null;
  }
}

/** Telegram: @nom, t.me/nom yoki toʻliq havola → https://t.me/nom. */
export function telegramUrl(raw: string): string | null {
  const text = raw.trim();
  const handle = /^@([A-Za-z0-9_]{3,64})$/.exec(text)?.[1];
  const url = httpsUrl(handle ? `t.me/${handle}` : text);
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.hostname !== "t.me" || parsed.pathname.length < 2) return null;
  return `https://t.me${parsed.pathname}${parsed.search}`;
}

/**
 * Oʻzbekiston raqami → «+998 XX XXX XX XX», guruhlar orasida boʻlinmas boʻshliq (satr uzilmaydi).
 * Toʻqqiz raqam kiritilsa 998 qoʻshiladi. Harf yoki boshqa belgi boʻlsa null.
 */
export function normalizePhone(raw: string): string | null {
  if (!/^[\d\s+()\u00a0-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  const full = digits.length === 9 ? `998${digits}` : digits;
  if (!/^998\d{9}$/.test(full)) return null;
  return ["+998", full.slice(3, 5), full.slice(5, 8), full.slice(8, 10), full.slice(10)].join(NBSP);
}

export function validEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) && value.length <= 254;
}

/** Butun son: boʻsh satr → null, notoʻgʻri → NaN (chaqiruvchi xato beradi). */
export function parseInteger(raw: string): number | null {
  const text = raw.trim();
  if (!text) return null;
  return /^-?\d+$/.test(text) ? Number(text) : Number.NaN;
}
