import { fill } from "@/i18n/format";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { FieldErrors, SaveNewsState } from "@/lib/admin/news/types";

import type { SaveTone } from "./SaveBar";

interface SaveBarInput {
  readonly state: SaveNewsState;
  readonly pending: boolean;
  readonly dirty: boolean;
  readonly uploads: number;
  readonly justSaved: boolean;
  readonly errors: FieldErrors;
}

const S = NEWS_COPY.save;

/** Saqlash paneli holat qatori: bir vaqtda bittasi, muhimi birinchi. */
export function saveBarState(input: SaveBarInput): { message: string; tone: SaveTone } {
  const { state, pending, dirty, uploads, justSaved, errors } = input;
  if (pending) return { message: S.saving, tone: "neutral" };
  /* Boshqa oynadagi oʻzgarish ustidan yozilmaydi: sahifa yangilanmaguncha ogohlantirish turadi. */
  if (state.status === "conflict") return { message: S.conflict, tone: "error" };
  const count = Object.keys(errors).length;
  if (count) return { message: fill(S.invalid, { n: count }), tone: "error" };
  if (state.status === "error") return { message: state.message, tone: "error" };
  if (uploads > 0) return { message: S.uploading, tone: "neutral" };
  if (dirty) return { message: S.dirty, tone: "neutral" };
  if (state.status === "saved" || justSaved) return { message: S.saved, tone: "success" };
  return { message: S.clean, tone: "neutral" };
}
