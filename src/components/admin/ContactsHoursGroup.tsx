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

/** Ish vaqti (besh tilda) va xarita nuqtasi: kenglik va uzunlik juft holda. */
export function ContactsHoursGroup({
  draft,
  patch,
  errors,
  idFor,
}: OrgSectionProps<ContactsDraft>) {
  const { hours, map } = draft;
  const coordinate = (axis: "lat" | "lng", label: string) => (
    <Field id={idFor(`map-${axis}`)} label={label} error={errors[`map-${axis}`]}>
      {(control) => (
        <Input
          {...control}
          inputMode="decimal"
          autoComplete="off"
          aria-describedby={[control["aria-describedby"], idFor("map-hint")]
            .filter(Boolean)
            .join(" ")}
          value={map[axis]}
          onChange={(event) => patch({ map: { ...map, [axis]: event.target.value } })}
        />
      )}
    </Field>
  );
  return (
    <FieldGroup id={idFor("hours-group")} title={C.groups.hours}>
      <LocaleField
        id={idFor("hours")}
        label={C.hours}
        hint={C.hoursHint}
        value={hours.value}
        onChange={(value) => patch({ hours: { ...hours, value } })}
        path="hours"
        errors={errors}
      />
      <StatusSelect
        id={idFor("hours-status")}
        field={C.hours}
        value={hours.status}
        onChange={(status) => patch({ hours: { ...hours, status } })}
      />
      <fieldset className="admin-locale">
        <legend className="t-label text-ink">{C.map}</legend>
        <p id={idFor("map-hint")} className="t-small text-ink-3">
          {C.mapHint}
        </p>
        <div className="admin-pair admin-pair-even">
          {coordinate("lat", C.lat)}
          {coordinate("lng", C.lng)}
        </div>
      </fieldset>
      <StatusSelect
        id={idFor("map-status")}
        field={C.map}
        value={map.status}
        onChange={(status) => patch({ map: { ...map, status } })}
      />
    </FieldGroup>
  );
}
