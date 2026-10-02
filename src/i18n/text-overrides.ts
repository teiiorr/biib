import type { Localized } from "@/content/types";

import type { Locale } from "./locales";

/** Lugʻatdagi tahrirlanadigan qiymat: bitta satr yoki satrlar roʻyxati. */
export type TextValue = string | readonly string[];
export type TextKind = "text" | "list";

/** Bazadagi site_texts.key tekshiruvi bilan bir xil: kamida ikki boʻgʻin, faqat harf va raqam. */
export const TEXT_KEY_RE = /^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/;

export interface TextEntry {
  /** Nuqtali yoʻl, masalan «home.hero.mission» yoki «privacy.sections.0.paragraphs». */
  readonly key: string;
  readonly kind: TextKind;
}

export function textKind(value: unknown): TextKind | null {
  if (typeof value === "string") return "text";
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) return "list";
  return null;
}

/**
 * Lugʻatning har bir satri va satrlar roʻyxati. Obyektlar roʻyxatiga indeks bilan kiriladi; boshqa
 * shakldagi qiymat (son, obyekt) tahrirlanmaydi.
 */
export function textEntries(dict: object): readonly TextEntry[] {
  const out: TextEntry[] = [];
  const walk = (value: unknown, path: readonly string[]): void => {
    const kind = textKind(value);
    if (kind) {
      const key = path.join(".");
      if (TEXT_KEY_RE.test(key)) out.push({ key, kind });
      return;
    }
    if (Array.isArray(value)) value.forEach((item, i) => walk(item, [...path, String(i)]));
    else if (value && typeof value === "object")
      for (const [name, item] of Object.entries(value)) walk(item, [...path, name]);
  };
  walk(dict, []);
  return out;
}

/** Kalit yoʻlidagi qiymat; yoʻl yoki shakl mos kelmasa undefined. */
export function textAt(dict: object, key: string): TextValue | undefined {
  let current: unknown = dict;
  for (const segment of key.split(".")) {
    if (Array.isArray(current)) {
      if (!/^\d+$/.test(segment)) return undefined;
      current = current[Number(segment)];
    } else if (current && typeof current === "object" && Object.hasOwn(current, segment)) {
      current = (current as Record<string, unknown>)[segment];
    } else return undefined;
  }
  return textKind(current) ? (current as TextValue) : undefined;
}

/* Faqat yoʻl boʻyidagi obyektlar nusxalanadi: modul darajasidagi lugʻat hech qachon oʻzgarmaydi. */
function replaceAt(node: unknown, segments: readonly string[], value: TextValue): unknown {
  const [head, ...rest] = segments;
  if (head === undefined) return value;
  if (Array.isArray(node)) {
    const copy = [...(node as unknown[])];
    const index = Number(head);
    copy[index] = replaceAt(copy[index], rest, value);
    return copy;
  }
  const record = node as Record<string, unknown>;
  return { ...record, [head]: replaceAt(record[head], rest, value) };
}

/**
 * Almashtirish boʻlmasa aynan oʻsha obyekt qaytadi, sahifa HTML kodi baytma-bayt oʻzgarmaydi.
 * Koddan yoʻqolgan yoki turi oʻzgargan kalit jimgina tashlab ketiladi.
 */
export function withTextOverrides<T extends object>(
  dict: T,
  texts: Readonly<Record<string, Localized<TextValue>>>,
  locale: Locale,
): T {
  let out = dict;
  for (const [key, value] of Object.entries(texts)) {
    const current = textAt(dict, key);
    const next = value[locale];
    if (current === undefined || textKind(next) !== textKind(current)) continue;
    out = replaceAt(out, key.split("."), next) as T;
  }
  return out;
}
