"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { ProjectDraft } from "@/lib/admin/org/project";

import { FieldGroup } from "./FieldGroup";
import { StatusField } from "./StatusField";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const P = UPOP_COPY.project;

/** Loyiha holati (radio va izohlar) hamda yosh oraligʻi oʻz holati bilan. */
export function UpopBasicsGroup({ draft, patch, errors, idFor }: OrgSectionProps<ProjectDraft>) {
  const age = (key: "ageFrom" | "ageTo", label: string) => (
    <Field id={idFor(key)} label={label} error={errors[key]}>
      {(control) => (
        <Input
          {...control}
          inputMode="numeric"
          autoComplete="off"
          maxLength={2}
          aria-describedby={[control["aria-describedby"], idFor("age-hint")]
            .filter(Boolean)
            .join(" ")}
          value={draft[key]}
          onChange={(event) => patch({ [key]: event.target.value })}
        />
      )}
    </Field>
  );
  return (
    <FieldGroup id={idFor("basics-group")} title={P.groups.basics}>
      <StatusField
        id={idFor("status")}
        legend={P.status}
        value={draft.status}
        onChange={(status) => patch({ status })}
        hints={P.statusHint}
      />
      <fieldset className="admin-locale">
        <legend className="t-label text-ink">{P.ageStatus}</legend>
        <p id={idFor("age-hint")} className="t-small text-ink-3">
          {P.ageHint}
        </p>
        <div className="admin-pair admin-pair-even">
          {age("ageFrom", P.ageFrom)}
          {age("ageTo", P.ageTo)}
        </div>
      </fieldset>
      <StatusSelect
        id={idFor("age-status")}
        field={P.ageStatus}
        value={draft.ageStatus}
        onChange={(ageStatus) => patch({ ageStatus })}
      />
    </FieldGroup>
  );
}
