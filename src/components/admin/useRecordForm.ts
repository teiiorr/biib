"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";

import type { RecordMeta } from "@/lib/admin/people/draft";
import type { FieldErrors } from "@/lib/admin/news/types";
import type { BuildResult, RecordSaveState } from "@/lib/admin/record";

import { firstErrorId, focusField } from "./editor-focus";
import { saveBarState } from "./save-state";
import { useLeaveGuard } from "./useLeaveGuard";

export interface RecordFormOptions<D, A, P> {
  readonly action: (prev: RecordSaveState<A>, formData: FormData) => Promise<RecordSaveState<A>>;
  readonly initial: D;
  /** null: yangi yozuv (saqlangach server oʻz sahifasiga yoʻnaltiradi). */
  readonly id: string | null;
  readonly updatedAt: string | null;
  readonly justSaved: boolean;
  readonly toPayload: (draft: D, meta: RecordMeta) => P;
  readonly build: (payload: P) => BuildResult<A>;
  /** Saqlangan (meʼyorlangan) maʼlumotdan yangi tahrir holati; rasm koʻrinishi joriy tahrirdan. */
  readonly fromSaved: (data: A, draft: D) => D;
  /** Xatoga fokus tartibi = sahifadagi tartib. */
  readonly fieldOrder: readonly string[];
  readonly idFor: (field: string) => string;
  readonly leaveMessage: string;
}

/**
 * Tahrir shaklining umumiy holati (odam, hamkor): server javobi, saqlanmagan oʻzgarish, eskirganlik
 * kaliti, brauzerdagi tekshiruv, xatoga fokus, chiqishdan himoya va rasmlar yuklanishi.
 */
export function useRecordForm<D extends object, A, P>(options: RecordFormOptions<D, A, P>) {
  const { action, initial, id, updatedAt, justSaved, toPayload, build, fromSaved } = options;
  const { fieldOrder, idFor, leaveMessage } = options;
  const [state, formAction, pending] = useActionState(action, {
    status: "idle",
    revision: 0,
  } as RecordSaveState<A>);
  const fingerprint = (draft: D) => JSON.stringify(toPayload(draft, { id: null, expected: null }));
  const [draft, setDraft] = useState(initial);
  const [baseline, setBaseline] = useState(() => fingerprint(initial));
  const [expected, setExpected] = useState(updatedAt);
  const [seen, setSeen] = useState(state.revision);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [uploads, setUploads] = useState(0);

  /* Server javobi kelgan render: saqlangan qiymatlar tahrirga qaytadi, yangi updated_at kutiladi. */
  if (state.revision !== seen) {
    setSeen(state.revision);
    if (state.status === "saved") {
      const next = fromSaved(state.data, draft);
      setDraft(next);
      setBaseline(fingerprint(next));
      setExpected(state.updatedAt);
    }
  }

  const errors =
    Object.keys(clientErrors).length || state.status !== "invalid" ? clientErrors : state.errors;
  const dirty = fingerprint(draft) !== baseline;
  const serverTarget =
    state.status === "invalid" ? firstErrorId(state.errors, fieldOrder, idFor) : null;
  useLeaveGuard(dirty && !pending, leaveMessage);
  /* Server rad etgan har javobda (bir xil xato qayta kelsa ham) fokus birinchi xatoga. */
  useEffect(() => {
    if (serverTarget) focusField(serverTarget);
  }, [state, serverTarget]);

  const payload = toPayload(draft, { id, expected });

  function submit(event: FormEvent<HTMLFormElement>): void {
    const result = build(payload);
    if (uploads > 0 || !result.ok) event.preventDefault();
    if (result.ok) {
      setClientErrors({});
      return;
    }
    setClientErrors(result.errors);
    const target = firstErrorId(result.errors, fieldOrder, idFor);
    if (target) focusField(target);
  }

  return {
    formAction,
    pending,
    draft,
    /** Funksional yangilash: kech tugagan yuklash ham eng soʻnggi holat ustiga yozadi. */
    patch: (next: Partial<D>) => {
      setDraft((d) => ({ ...d, ...next }));
      /* Tuzatilayotgan maydonning eski xatosi darhol yoʻqoladi; qolganlari keyingi saqlashgacha. */
      const fields = Object.keys(next);
      setClientErrors((current) => {
        const kept = Object.entries(current).filter(
          ([key]) => !fields.includes(key.split(".")[0] ?? key),
        );
        return kept.length === Object.keys(current).length ? current : Object.fromEntries(kept);
      });
    },
    errors,
    payload: JSON.stringify(payload),
    submit,
    uploads,
    onBusy: (delta: 1 | -1) => setUploads((n) => n + delta),
    bar: saveBarState({ state, pending, dirty, uploads, justSaved, errors }),
  };
}
