"use client";

import { useId, useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { pathFor } from "@/i18n/routes";
import { savePartner } from "@/lib/admin/actions/partners";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { MediaItem } from "@/lib/admin/news/types";
import { buildPartner, normalizeHref } from "@/lib/admin/partners/build";
import { partnerDraftFromAdmin, partnerToPayload } from "@/lib/admin/partners/draft";
import type { PartnerDraft } from "@/lib/admin/partners/types";
import { mergeMedia } from "@/lib/admin/people/draft";

import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { LogoField } from "./LogoField";
import { PartnerGroupField } from "./PartnerGroupField";
import { SaveBar } from "./SaveBar";
import { StatusField } from "./StatusField";
import { useRecordForm } from "./useRecordForm";

export interface PartnerEditorProps {
  /** null: yangi hamkor. */
  readonly id: string | null;
  readonly initial: PartnerDraft;
  readonly updatedAt: string | null;
  readonly justSaved: boolean;
  readonly library: readonly MediaItem[];
}

const T = PEOPLE_COPY.editor;
const P = PEOPLE_COPY.partners;
const FIELD_ORDER = ["name", "href"] as const;

/** Hamkor: chapda holat, nomi, guruh va sayt; oʻngda logotip saytdagi plitkada. */
export function PartnerEditor({ id, initial, updatedAt, justSaved, library }: PartnerEditorProps) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const [media, setMedia] = useState(library);
  const f = useRecordForm({
    action: savePartner,
    initial,
    id,
    updatedAt,
    justSaved,
    toPayload: partnerToPayload,
    build: buildPartner,
    fromSaved: (data, draft) =>
      partnerDraftFromAdmin(data, new Map(draft.logo ? [[draft.logo.id, draft.logo]] : [])),
    fieldOrder: FIELD_ORDER,
    idFor,
    leaveMessage: NEWS_COPY.save.leave,
  });
  const { draft, patch, errors } = f;

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
              hints={PEOPLE_COPY.statusHint.partner}
            />
            <LocaleField
              id={idFor("name")}
              label={P.name}
              hint={P.nameHint}
              value={draft.name}
              onChange={(name) => patch({ name })}
              path="name"
              errors={errors}
              required={draft.status !== "pending"}
            />
            <PartnerGroupField
              id={idFor("group")}
              legend={P.group}
              value={draft.group}
              onChange={(group) => patch({ group })}
            />
            <Field id={idFor("href")} label={P.href} hint={P.hrefHint} error={errors.href}>
              {(control) => (
                <Input
                  {...control}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="done"
                  placeholder="https://"
                  value={draft.href}
                  onChange={(event) => patch({ href: event.target.value })}
                  onBlur={() => patch({ href: normalizeHref(draft.href) })}
                />
              )}
            </Field>
          </FieldGroup>
        </div>
        <div className="admin-editor-side">
          <FieldGroup id={idFor("logo-group")} title={T.groups.logo}>
            <LogoField
              id={idFor("logo")}
              value={draft.logo}
              onChange={(logo) => patch({ logo })}
              name={draft.name.uz}
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
        viewHref={id ? pathFor("uz", "partners") : null}
      />
    </form>
  );
}
