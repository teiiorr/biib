import type { FieldErrors, NewsDraft } from "@/lib/admin/news/types";

export interface EditorSectionProps {
  readonly draft: NewsDraft;
  /** Funksional yangilash: kech tugagan yuklash ham eng soʻnggi holat ustiga yoziladi. */
  readonly patch: (next: Partial<NewsDraft>) => void;
  readonly errors: FieldErrors;
  readonly idFor: (field: string) => string;
}

/** Xatoga fokus tartibi sahifadagi tartib bilan bir xil: avval chap ustun, keyin oʻng. */
export const FIELD_ORDER = [
  "date",
  "slug",
  "topic",
  "title",
  "lead",
  "body",
  "quote",
  "coverAlt",
  "photos",
] as const;
