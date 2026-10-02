"use client";

import { useId } from "react";

import { pathFor } from "@/i18n/routes";
import { saveContacts } from "@/lib/admin/actions/contacts";
import { ORG_COPY } from "@/lib/admin/copy-org";
import {
  buildContacts,
  contactsErrorOrder,
  draftFromContacts,
  type ContactsDraft,
} from "@/lib/admin/org/contacts";

import { AdminIcon } from "./AdminIcon";
import { ContactsAddressGroup } from "./ContactsAddressGroup";
import { ContactsHoursGroup } from "./ContactsHoursGroup";
import { ContactsReachGroup } from "./ContactsReachGroup";
import { SaveBar } from "./SaveBar";
import { SocialsGroup } from "./SocialsGroup";
import { useOrgEditor } from "./useOrgEditor";

interface ContactsEditorProps {
  readonly initial: ContactsDraft;
  /** Aloqa va tarmoqlar uchun umumiy kutilgan versiya. */
  readonly version: string;
}

const C = ORG_COPY.contacts;

/**
 * Saqlash hamma sahifaning pastki qismini va JSON-LD maʼlumotini oʻzgartiradi, shu sabab tepada
 * ogohlantirish turadi.
 */
export function ContactsEditor({ initial, version }: ContactsEditorProps) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const editor = useOrgEditor({
    action: saveContacts,
    initial,
    version,
    keyOf: (draft) => JSON.stringify(draft),
    check: (draft) => {
      const built = buildContacts(draft);
      return built.ok ? {} : built.errors;
    },
    fromSaved: (data) => draftFromContacts(data.contacts, data.socials),
    errorOrder: contactsErrorOrder,
    idFor,
  });
  const { draft, setDraft, errors } = editor;
  const shared = {
    draft,
    patch: (next: Partial<ContactsDraft>) => setDraft((d) => ({ ...d, ...next })),
    errors,
    idFor,
  };
  return (
    <form action={editor.formAction} onSubmit={editor.submit} className="admin-editor" noValidate>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({ draft, expected: editor.version })}
      />
      <p className="admin-note t-small" role="note">
        <AdminIcon name="alert" size={16} />
        <span>{C.warning}</span>
      </p>
      <p className="t-small text-ink-3">{C.statusHint}</p>
      <ContactsAddressGroup {...shared} />
      <ContactsReachGroup {...shared} />
      <ContactsHoursGroup {...shared} />
      <SocialsGroup {...shared} />
      <SaveBar
        message={editor.bar.message}
        tone={editor.bar.tone}
        saving={editor.pending}
        viewHref={pathFor("uz", "contacts")}
      />
    </form>
  );
}
