"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";

import { fill } from "@/i18n/format";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { FieldErrors } from "@/lib/admin/news/types";
import type { OrgSaveState } from "@/lib/admin/org/types";

import { firstErrorId, focusField } from "./editor-focus";
import type { SaveTone } from "./SaveBar";
import { useLeaveGuard } from "./useLeaveGuard";

export interface OrgEditorOptions<D, T> {
  readonly action: (prev: OrgSaveState<T>, formData: FormData) => Promise<OrgSaveState<T>>;
  readonly initial: D;
  /** Sahifa yuklangandagi versiya (updated_at yoki roʻyxat izi). */
  readonly version: string | null;
  /** Saqlanmagan oʻzgarishni aniqlash uchun iz. */
  readonly keyOf: (draft: D) => string;
  /** Server bilan bir xil tekshiruv: xato boʻlsa soʻrov ketmaydi. */
  readonly check: (draft: D) => FieldErrors;
  readonly fromSaved: (data: T, draft: D) => D;
  /** Fokus birinchi xatoga tushishi uchun sahifadagi tartib. */
  readonly errorOrder: (draft: D) => readonly string[];
  readonly idFor: (field: string) => string;
  /** Yuklanayotgan rasmlar soni: tugaguncha saqlash kutadi. */
  readonly uploads?: number;
}

export interface OrgSectionProps<D> {
  readonly draft: D;
  readonly patch: (next: Partial<D>) => void;
  readonly errors: FieldErrors;
  readonly idFor: (field: string) => string;
}

const S = NEWS_COPY.save;

function barState<T>(
  state: OrgSaveState<T>,
  pending: boolean,
  dirty: boolean,
  uploads: number,
  errors: FieldErrors,
): { message: string; tone: SaveTone } {
  if (pending) return { message: S.saving, tone: "neutral" };
  if (state.status === "conflict") return { message: S.conflict, tone: "error" };
  const count = Object.keys(errors).length;
  if (count) return { message: fill(S.invalid, { n: count }), tone: "error" };
  if (state.status === "error") return { message: state.message, tone: "error" };
  if (uploads > 0) return { message: S.uploading, tone: "neutral" };
  if (dirty) return { message: S.dirty, tone: "neutral" };
  if (state.status === "saved") return { message: S.saved, tone: "success" };
  return { message: S.clean, tone: "neutral" };
}

/**
 * Holat yashirin maydonda JSON boʻlib server amaliga ketadi, javobdagi meʼyorlangan qiymat tahrirga
 * qaytadi. Xulqi yangilik tahriri bilan bir xil.
 */
export function useOrgEditor<D, T>(options: OrgEditorOptions<D, T>) {
  const { action, initial, keyOf, check, fromSaved, errorOrder, idFor, uploads = 0 } = options;
  const [state, formAction, pending] = useActionState<OrgSaveState<T>, FormData>(action, {
    status: "idle",
    revision: 0,
  });
  const [draft, setDraft] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [version, setVersion] = useState(options.version);
  const [seen, setSeen] = useState(state.revision);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  /* Yangi server javobi: saqlangan qiymat tahrirga ham, solishtirish asosiga ham yoziladi. */
  if (state.revision !== seen) {
    setSeen(state.revision);
    if (state.status === "saved") {
      const next = fromSaved(state.data, draft);
      setDraft(next);
      setBaseline(next);
      setVersion(state.version);
    }
  }

  const errors =
    Object.keys(clientErrors).length || state.status !== "invalid" ? clientErrors : state.errors;
  const dirty = keyOf(draft) !== keyOf(baseline);
  const serverTarget =
    state.status === "invalid" ? firstErrorId(state.errors, errorOrder(draft), idFor) : null;
  useLeaveGuard(dirty && !pending, S.leave);
  useEffect(() => {
    if (serverTarget) focusField(serverTarget);
  }, [state, serverTarget]);

  function submit(event: FormEvent<HTMLFormElement>): void {
    const found = check(draft);
    const invalid = Object.keys(found).length > 0;
    if (uploads > 0 || invalid) event.preventDefault();
    setClientErrors(found);
    const target = invalid ? firstErrorId(found, errorOrder(draft), idFor) : null;
    if (target) focusField(target);
  }

  return {
    state,
    formAction,
    pending,
    draft,
    setDraft,
    baseline,
    setBaseline,
    version,
    errors,
    dirty,
    submit,
    bar: barState(state, pending, dirty, uploads, errors),
  };
}
