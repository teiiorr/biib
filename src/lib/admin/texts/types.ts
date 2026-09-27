import type { Localized } from "@/content/types";
import type { TextKind, TextValue } from "@/i18n/text-overrides";

import type { FieldErrors } from "../news/types";

/** Roʻyxatdagi bitta kalit: qidiruv shu maʼlumot ustida brauzerda ishlaydi. */
export interface TextListRow {
  readonly key: string;
  readonly namespace: string;
  readonly kind: TextKind;
  /** Saytdagi amaldagi oʻzbekcha matn (roʻyxat bandlari « · » bilan). */
  readonly preview: string;
  readonly changed: boolean;
  /** Kalit va besh tildagi matn, kichik harflarda: qidiruv uchun. */
  readonly haystack: string;
}

/** Tahrir oynasiga keladigan kalit maʼlumoti (serverdan, JSON ga oʻtadigan shakl). */
export interface TextEditorEntry {
  readonly key: string;
  readonly kind: TextKind;
  readonly tokens: readonly string[];
  readonly bundled: Localized<TextValue>;
  /** SEO kaliti boʻlsa tavsiya etilgan uzunlik. */
  readonly limit: number | null;
}

export type SaveTextState =
  | { readonly status: "idle"; readonly revision: number }
  | {
      readonly status: "saved";
      readonly revision: number;
      readonly updatedAt: string;
      readonly value: Localized<TextValue>;
    }
  | { readonly status: "invalid"; readonly revision: number; readonly errors: FieldErrors }
  | { readonly status: "conflict"; readonly revision: number }
  | { readonly status: "error"; readonly revision: number; readonly message: string };
