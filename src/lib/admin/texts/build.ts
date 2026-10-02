import type { Localized } from "@/content/types";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import type { TextKind, TextValue } from "@/i18n/text-overrides";

import { SYSTEM_COPY } from "../copy-system";
import type { FieldErrors } from "../news/types";
import { fromParagraphs, normalizeLocalized, toParagraphs } from "../text/locales";

export interface TextSpec {
  readonly kind: TextKind;
  readonly tokens: readonly string[];
}

export type BuildTextResult =
  | { readonly ok: true; readonly value: Localized<TextValue> }
  | { readonly ok: false; readonly errors: FieldErrors };

const E = SYSTEM_COPY.texts.errors;
const TOKEN_RE = /\{\w+\}/g;

/** fill() almashtiradigan {belgi}lar, takrorsiz va tartiblangan. */
export function tokensOf(value: TextValue): readonly string[] {
  const text = typeof value === "string" ? value : value.join("\n");
  return [...new Set(text.match(TOKEN_RE) ?? [])].sort();
}

/** Roʻyxat bandlari tahrir maydonida boʻsh qator bilan ajratilgan bitta matnga aylanadi. */
export function draftFromValue(value: Localized<TextValue>): Localized {
  const out = {} as Record<(typeof LOCALES)[number], string>;
  for (const locale of LOCALES) {
    const item = value[locale];
    out[locale] = typeof item === "string" ? item : fromParagraphs(item);
  }
  return out;
}

/** SEO kalitlari uchun tavsiya etilgan uzunlik: sarlavha 60, tavsif 155 belgi. */
export function textLimit(key: string): number | undefined {
  if (!key.startsWith("meta.")) return undefined;
  if (key.endsWith(".title")) return 60;
  if (key.endsWith(".description")) return 155;
  return undefined;
}

/**
 * Har til meʼyorlanadi, boʻsh kirill va 2026 qatori oʻzbekchadan toʻldiriladi. Besh til majburiy,
 * {belgi}lar toʻplami asl matndagi bilan bir xil boʻlishi shart. Brauzer ham, server ham shuni chaqiradi.
 */
export function buildText(spec: TextSpec, draft: Localized): BuildTextResult {
  const errors: Record<string, string> = {};
  const text = normalizeLocalized(draft);
  const value = {} as Record<(typeof LOCALES)[number], TextValue>;
  for (const locale of LOCALES) {
    const lang = LOCALE_META[locale].nativeName;
    const item: TextValue = spec.kind === "list" ? toParagraphs(text[locale]) : text[locale].trim();
    value[locale] = item;
    if (!item.length) {
      errors[`value.${locale}`] = fill(E.required, { lang });
      continue;
    }
    const found = tokensOf(item);
    const missing = spec.tokens.filter((token) => !found.includes(token));
    const extra = found.filter((token) => !spec.tokens.includes(token));
    if (missing.length)
      errors[`value.${locale}`] = fill(E.missing, { lang, tokens: missing.join(" ") });
    else if (extra.length)
      errors[`value.${locale}`] = fill(E.extra, { lang, tokens: extra.join(" ") });
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value };
}
