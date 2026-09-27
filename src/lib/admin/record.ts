import type { Localized } from "@/content/types";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";

import { PEOPLE_COPY } from "./copy-people";
import { NEWS_COPY } from "./copy-news";
import { dbErrorKind } from "./db-errors";
import type { FieldErrors } from "./news/types";

/** Tahrir shaklining server javobi: odam va hamkor (yangilik ham xuddi shu tuzilmada). */
export type RecordSaveState<A> =
  | { readonly status: "idle"; readonly revision: number }
  | {
      readonly status: "saved";
      readonly revision: number;
      readonly updatedAt: string;
      readonly data: A;
    }
  | { readonly status: "invalid"; readonly revision: number; readonly errors: FieldErrors }
  | { readonly status: "conflict"; readonly revision: number }
  | { readonly status: "error"; readonly revision: number; readonly message: string };

export type BuildResult<T> =
  { readonly ok: true; readonly input: T } | { readonly ok: false; readonly errors: FieldErrors };

/** Tartiblash natijasi: yangi tartib va yangilangan updated_at (keyingi oʻchirish shu bilan ishlaydi). */
export type ReorderResult<R> =
  | { readonly ok: true; readonly rows: readonly R[] }
  | { readonly ok: false; readonly message: string };

export function hasText(value: Localized): boolean {
  return LOCALES.some((locale) => value[locale].trim() !== "");
}

export function requireAll(
  errors: Record<string, string>,
  path: string,
  value: Localized,
  locales: readonly Locale[] = LOCALES,
): void {
  for (const locale of locales) {
    if (!value[locale].trim())
      errors[`${path}.${locale}`] = fill(NEWS_COPY.errors.required, {
        lang: LOCALE_META[locale].nativeName,
      });
  }
}

/** Ixtiyoriy besh tilli maydon: boʻsh boʻlsa null; yozilgan boʻlsa bazadagi domen beshala tilni talab qiladi. */
export function optionalLocalized(
  errors: Record<string, string>,
  path: string,
  value: Localized,
): Localized | null {
  if (!hasText(value)) return null;
  requireAll(errors, path, value);
  return value;
}

/** Saqlash RPC si rad etganda: eskirgan yozuv alohida holat, qolgani holat qatoridagi xabar. */
export function recordFailure<A>(revision: number, code: string | undefined): RecordSaveState<A> {
  const kind = dbErrorKind({ code });
  if (kind === "conflict") return { status: "conflict", revision };
  const message =
    kind === "notFound"
      ? PEOPLE_COPY.errors.notFound
      : kind === "media"
        ? NEWS_COPY.errors.media
        : kind === "denied"
          ? NEWS_COPY.errors.denied
          : kind === "invalid"
            ? PEOPLE_COPY.errors.invalid
            : NEWS_COPY.errors.generic;
  return { status: "error", revision, message };
}

/**
 * Oʻchirish va tartiblash xabari (dialog yoki roʻyxat ostida). Tartiblashda «invalid» = kalitlar
 * roʻyxati bazadagisiga mos emas: boshqa oynada kimdir qoʻshilgan yoki oʻchirilgan.
 */
export function recordMessage(code: string | undefined): string {
  const kind = dbErrorKind({ code });
  if (kind === "conflict") return NEWS_COPY.save.conflict;
  if (kind === "notFound") return PEOPLE_COPY.errors.notFound;
  if (kind === "invalid") return PEOPLE_COPY.list.stale;
  if (kind === "denied") return NEWS_COPY.errors.denied;
  return NEWS_COPY.errors.generic;
}
