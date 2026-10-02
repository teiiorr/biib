/** Baza funksiyalari xatoni Postgres kodi bilan qaytaradi. */
export type DbErrorKind =
  "conflict" | "notFound" | "slugTaken" | "media" | "denied" | "invalid" | "unknown";

export function dbErrorKind(error: { readonly code?: string | undefined } | null): DbErrorKind {
  switch (error?.code) {
    /* PT409 (HTTP 409) 20261001000106-migratsiyadan beri keladi, 40001 undan oldingi bazadan. */
    case "PT409":
    case "40001":
      return "conflict";
    case "P0002":
      return "notFound";
    case "23505":
      return "slugTaken";
    case "23503":
      return "media";
    case "42501":
    case "PGRST301":
    case "PGRST303":
      return "denied";
    case "22023":
    case "22P02":
    case "23514":
      return "invalid";
    default:
      return "unknown";
  }
}

/** Oddiy amallar natijasi (oʻchirish, qaytarish, saytni yangilash). */
export type ActionResult = { readonly ok: true } | { readonly ok: false; readonly message: string };
