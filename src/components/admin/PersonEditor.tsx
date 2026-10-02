"use client";

import { useId, useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { PersonKind } from "@/content/types";
import { savePerson } from "@/lib/admin/actions/people";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { MediaItem } from "@/lib/admin/news/types";
import { buildPerson } from "@/lib/admin/people/build";
import { mergeMedia, personDraftFromAdmin, personToPayload } from "@/lib/admin/people/draft";
import { personPublicPath } from "@/lib/admin/people/kinds";
import type { PersonDraft } from "@/lib/admin/people/types";

import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { PortraitField } from "./PortraitField";
import { SaveBar } from "./SaveBar";
import { StatusField } from "./StatusField";
import { useRecordForm } from "./useRecordForm";

export interface PersonEditorProps {
  readonly kind: PersonKind;
  /** null: yangi odam. */
  readonly id: string | null;
  /** Saytdagi karta kaliti: «Saytda koʻrish» shu joyga olib boradi. */
  readonly personKey: string | null;
  readonly initial: PersonDraft;
  readonly updatedAt: string | null;
  readonly justSaved: boolean;
  readonly library: readonly MediaItem[];
}

const T = PEOPLE_COPY.editor;
const FIELD_ORDER = ["name", "role", "field", "bio", "email"] as const;

export function PersonEditor({
  kind,
  id,
  personKey,
  initial,
  updatedAt,
  justSaved,
  library,
}: PersonEditorProps) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const [media, setMedia] = useState(library);
  const f = useRecordForm({
    action: savePerson,
    initial,
    id,
    updatedAt,
    justSaved,
    toPayload: (draft: PersonDraft, meta) => personToPayload(draft, kind, meta),
    build: buildPerson,
    fromSaved: (data, draft) =>
      personDraftFromAdmin(data, new Map(draft.photo ? [[draft.photo.id, draft.photo]] : [])),
    fieldOrder: FIELD_ORDER,
    idFor,
    leaveMessage: NEWS_COPY.save.leave,
  });
  const { draft, patch, errors } = f;
  const expert = kind === "expert";

  return (
    <form action={f.formAction} onSubmit={f.submit} className="admin-editor" noValidate>
      <input type="hidden" name="payload" value={f.payload} />
      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <FieldGroup id={idFor("main-group")} title={T.groups.main}>
            <StatusField
              id={idFor("status")}
              legend={T.status}
              value={draft.status}
              onChange={(status) => patch({ status })}
              hints={PEOPLE_COPY.statusHint.person}
            />
            <LocaleField
              id={idFor("name")}
              label={T.name}
              hint={T.nameHint}
              value={draft.name}
              onChange={(name) => patch({ name })}
              path="name"
              errors={errors}
              required={draft.status === "confirmed"}
            />
            <LocaleField
              id={idFor("role")}
              label={T.role}
              hint={T.roleHint}
              value={draft.role}
              onChange={(role) => patch({ role })}
              path="role"
              errors={errors}
              required
            />
            {expert ? (
              <>
                <LocaleField
                  id={idFor("field")}
                  label={T.field}
                  hint={T.fieldHint}
                  value={draft.field}
                  onChange={(field) => patch({ field })}
                  path="field"
                  errors={errors}
                />
                <LocaleField
                  id={idFor("bio")}
                  label={T.bio}
                  hint={T.bioHint}
                  value={draft.bio}
                  onChange={(bio) => patch({ bio })}
                  path="bio"
                  errors={errors}
                  multiline
                />
              </>
            ) : null}
            <Field id={idFor("email")} label={T.email} hint={T.emailHint} error={errors.email}>
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="done"
                  value={draft.email}
                  onChange={(event) => patch({ email: event.target.value })}
                />
              )}
            </Field>
          </FieldGroup>
        </div>
        <div className="admin-editor-side">
          <FieldGroup id={idFor("photo-group")} title={T.groups.photo}>
            <PortraitField
              id={idFor("photo")}
              value={draft.photo}
              onChange={(photo) => patch({ photo })}
              alt={draft.name.uz || T.photo}
              library={media}
              onUploaded={(items) => setMedia((list) => mergeMedia(items, list))}
              onBusy={f.onBusy}
            />
          </FieldGroup>
        </div>
      </div>
      <SaveBar
        message={f.bar.message}
        tone={f.bar.tone}
        saving={f.pending}
        blockedReason={f.uploads > 0 ? NEWS_COPY.save.uploading : null}
        viewHref={personKey ? personPublicPath(kind, personKey) : null}
      />
    </form>
  );
}
