"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ORG_COPY } from "@/lib/admin/copy-org";
import type { ContactsDraft } from "@/lib/admin/org/contacts";

import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const C = ORG_COPY.contacts;

/** Manzil besh tilda va uning holati, ostida qidiruv tizimlari uchun indeks va shahar. */
export function ContactsAddressGroup({
  draft,
  patch,
  errors,
  idFor,
}: OrgSectionProps<ContactsDraft>) {
  const { address } = draft;
  return (
    <FieldGroup id={idFor("address-group")} title={C.groups.address}>
      <LocaleField
        id={idFor("address")}
        label={C.address}
        hint={C.addressHint}
        value={address.value}
        onChange={(value) => patch({ address: { ...address, value } })}
        path="address"
        errors={errors}
        multiline
      />
      <StatusSelect
        id={idFor("address-status")}
        field={C.address}
        value={address.status}
        onChange={(status) => patch({ address: { ...address, status } })}
      />
      <div className="admin-pair admin-pair-even">
        <Field
          id={idFor("postalCode")}
          label={C.postalCode}
          hint={C.postalCodeHint}
          error={errors.postalCode}
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              value={draft.postalCode}
              onChange={(event) => patch({ postalCode: event.target.value })}
            />
          )}
        </Field>
        <Field
          id={idFor("locality")}
          label={C.locality}
          hint={C.localityHint}
          error={errors.locality}
        >
          {(control) => (
            <Input
              {...control}
              autoComplete="off"
              lang="en"
              value={draft.locality}
              onChange={(event) => patch({ locality: event.target.value })}
            />
          )}
        </Field>
      </div>
    </FieldGroup>
  );
}
