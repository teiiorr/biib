"use client";

import { useActionState, useEffect, useId, useState, type FormEvent } from "react";

import type { Localized } from "@/content/types";
import { fill } from "@/i18n/format";
import type { TextValue } from "@/i18n/text-overrides";
import { saveText } from "@/lib/admin/actions/texts";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { FieldErrors } from "@/lib/admin/news/types";
import { buildText, draftFromValue } from "@/lib/admin/texts/build";
import type { SaveTextState, TextEditorEntry } from "@/lib/admin/texts/types";

import { BundledValues } from "./BundledValues";
import { firstErrorId, focusField } from "./editor-focus";
import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { LocaleListField } from "./LocaleListField";
import { SaveBar, type SaveTone } from "./SaveBar";
import { TextRestore } from "./TextRestore";
import { useLeaveGuard } from "./useLeaveGuard";

export interface TextEditorProps {
  readonly entry: TextEditorEntry;
  /** null boʻlsa saytda lugʻatdagi asl matn turadi. */
  readonly stored: { readonly value: Localized<TextValue>; readonly updatedAt: string } | null;
  readonly viewHref: string;
  readonly section: string;
}

const IDLE: SaveTextState = { status: "idle", revision: 0 };
const T = SYSTEM_COPY.texts;
const S = NEWS_COPY.save;
const ORDER = ["value"] as const;
/* Uzun matnning oxiri bir qatorli maydonda koʻrinmay qolardi. */
const LONG_TEXT = 90;

function hintFor(entry: TextEditorEntry): string {
  const parts: string[] = [entry.kind === "list" ? T.listHint : T.valueHint];
  if (entry.tokens.length) parts.push(fill(T.tokensHint, { tokens: entry.tokens.join(" ") }));
  if (entry.limit === 60) parts.push(T.titleHint);
  if (entry.limit === 155) parts.push(T.descriptionHint);
  return parts.join(" ");
}

interface BarInput {
  readonly state: SaveTextState;
  readonly pending: boolean;
  readonly dirty: boolean;
  readonly restored: boolean;
  readonly errors: FieldErrors;
}

function barState({ state, pending, dirty, restored, errors }: BarInput): {
  message: string;
  tone: SaveTone;
} {
  if (pending) return { message: S.saving, tone: "neutral" };
  if (state.status === "conflict") return { message: S.conflict, tone: "error" };
  const count = Object.keys(errors).length;
  if (count) return { message: fill(S.invalid, { n: count }), tone: "error" };
  if (state.status === "error") return { message: state.message, tone: "error" };
  if (dirty) return { message: S.dirty, tone: "neutral" };
  if (restored) return { message: T.restored, tone: "success" };
  if (state.status === "saved") return { message: S.saved, tone: "success" };
  return { message: S.clean, tone: "neutral" };
}

/** Brauzer ham server kabi tekshiradi: qoidalar build.ts faylida bitta. */
export function TextEditor({ entry, stored, viewHref, section }: TextEditorProps) {
  const [state, formAction, pending] = useActionState(saveText, IDLE);
  const [draft, setDraft] = useState(() => draftFromValue(stored?.value ?? entry.bundled));
  const [baseline, setBaseline] = useState(() => JSON.stringify(draft));
  const [updatedAt, setUpdatedAt] = useState(stored?.updatedAt ?? null);
  const [restored, setRestored] = useState(false);
  const [seen, setSeen] = useState(state.revision);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const form = useId().replace(/:/g, "");
  const fieldId = `${form}-value`;

  /* Yangi server javobi: meʼyorlangan qiymat tahrirga qaytadi. */
  if (state.revision !== seen) {
    setSeen(state.revision);
    if (state.status === "saved") {
      const next = draftFromValue(state.value);
      setDraft(next);
      setBaseline(JSON.stringify(next));
      setUpdatedAt(state.updatedAt);
      setRestored(false);
    }
  }

  const errors =
    Object.keys(clientErrors).length || state.status !== "invalid" ? clientErrors : state.errors;
  const dirty = JSON.stringify(draft) !== baseline;
  const serverTarget =
    state.status === "invalid" ? firstErrorId(state.errors, ORDER, () => fieldId) : null;
  useLeaveGuard(dirty && !pending, S.leave);
  useEffect(() => {
    if (serverTarget) focusField(serverTarget);
  }, [state, serverTarget]);

  function submit(event: FormEvent<HTMLFormElement>): void {
    const result = buildText(entry, draft);
    if (result.ok) {
      setClientErrors({});
      return;
    }
    event.preventDefault();
    setClientErrors(result.errors);
    const target = firstErrorId(result.errors, ORDER, () => fieldId);
    if (target) focusField(target);
  }

  function reset(): void {
    const next = draftFromValue(entry.bundled);
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setUpdatedAt(null);
    setClientErrors({});
    setRestored(true);
  }

  const bar = barState({ state, pending, dirty, restored, errors });
  const long = typeof entry.bundled.uz === "string" && entry.bundled.uz.length > LONG_TEXT;
  const field = {
    id: fieldId,
    label: T.value,
    hint: hintFor(entry),
    value: draft,
    onChange: setDraft,
    path: "value",
    errors,
    required: true,
  };
  return (
    <form action={formAction} onSubmit={submit} className="admin-editor" noValidate>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({ key: entry.key, value: draft, expected: updatedAt })}
      />
      {updatedAt ? <TextRestore textKey={entry.key} onRestored={reset} /> : null}
      <FieldGroup id={`${form}-value-group`} title={section}>
        {entry.kind === "list" ? (
          <LocaleListField {...field} />
        ) : (
          <LocaleField {...field} multiline={long} {...(entry.limit ? { max: entry.limit } : {})} />
        )}
      </FieldGroup>
      <FieldGroup id={`${form}-bundled-group`} title={T.bundledTitle}>
        <p className="t-small text-ink-3">{T.bundledHint}</p>
        <BundledValues bundled={entry.bundled} />
      </FieldGroup>
      <SaveBar
        message={bar.message}
        tone={bar.tone}
        saving={pending}
        blockedReason={state.status === "conflict" ? S.conflict : null}
        viewHref={viewHref}
      />
    </form>
  );
}
