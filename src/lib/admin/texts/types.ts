import type { Localized } from "@/content/types";
import type { TextKind, TextValue } from "@/i18n/text-overrides";

import type { FieldErrors } from "../news/types";

/** Qidiruv shu maʼlumot ustida brauzerda ishlaydi. */
export interface TextListRow {
  readonly key: string;
  readonly namespace: string;
  readonly kind: TextKind;
  /** Saytdagi amaldagi oʻzbekcha matn; roʻyxat bandlari « · » bilan ulanadi. */
  readonly preview: string;
  readonly changed: boolean;
  /** Qidiruv uchun kalit va besh tildagi matn, kichik harflarda. */
  readonly haystack: string;
}

/** Serverdan tahrir oynasiga JSON koʻrinishida keladi. */
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
