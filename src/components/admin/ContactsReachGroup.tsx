"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ORG_COPY } from "@/lib/admin/copy-org";
import type { ContactsDraft } from "@/lib/admin/org/contacts";
import { telegramUrl } from "@/lib/admin/org/fields";

import { FieldGroup } from "./FieldGroup";
import { PhonesField } from "./PhonesField";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const C = ORG_COPY.contacts;

/** Telefonlar, elektron pochta va Telegram: har biri oʻz holati bilan. */
export function ContactsReachGroup({
  draft,
  patch,
  errors,
  idFor,
}: OrgSectionProps<ContactsDraft>) {
  const { phones, email, telegram } = draft;
  return (
    <FieldGroup id={idFor("reach-group")} title={C.groups.reach}>
      <PhonesField
        idFor={idFor}
        value={phones.value}
        onChange={(value) => patch({ phones: { ...phones, value } })}
        errors={errors}
      />
      <StatusSelect
        id={idFor("phones-status")}
        field={C.phones}
        value={phones.status}
        onChange={(status) => patch({ phones: { ...phones, status } })}
      />
      <div className="admin-pair">
        <Field id={idFor("email")} label={C.email} error={errors.email}>
          {(control) => (
            <Input
              {...control}
              type="email"
              inputMode="email"
              autoComplete="off"
              value={email.value}
              onChange={(event) => patch({ email: { ...email, value: event.target.value } })}
            />
          )}
        </Field>
        <StatusSelect
          id={idFor("email-status")}
          field={C.email}
          value={email.status}
          onChange={(status) => patch({ email: { ...email, status } })}
        />
      </div>
      <div className="admin-pair">
        <Field
          id={idFor("telegram")}
          label={C.telegram}
          hint={C.telegramHint}
          error={errors.telegram}
        >
          {(control) => (
            <Input
              {...control}
              type="url"
              inputMode="url"
              autoComplete="off"
              value={telegram.value}
              onChange={(event) => patch({ telegram: { ...telegram, value: event.target.value } })}
              onBlur={() => {
                const url = telegramUrl(telegram.value);
                if (url && url !== telegram.value) patch({ telegram: { ...telegram, value: url } });
              }}
            />
          )}
        </Field>
        <StatusSelect
          id={idFor("telegram-status")}
          field={C.telegram}
          value={telegram.status}
          onChange={(status) => patch({ telegram: { ...telegram, status } })}
        />
      </div>
    </FieldGroup>
  );
}
