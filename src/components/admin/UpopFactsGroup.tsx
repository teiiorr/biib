"use client";

import { UPOP_COPY } from "@/lib/admin/copy-upop";
import { FACT_KEYS, type ProjectDraft } from "@/lib/admin/org/project";

import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const P = UPOP_COPY.project;

export function UpopFactsGroup({ draft, patch, errors, idFor }: OrgSectionProps<ProjectDraft>) {
  return (
    <FieldGroup id={idFor("facts-group")} title={P.groups.facts}>
      <p className="t-small text-ink-3">{P.factHint}</p>
      {FACT_KEYS.map((key) => {
        const fact = draft.facts[key];
        const set = (next: Partial<typeof fact>) =>
          patch({ facts: { ...draft.facts, [key]: { ...fact, ...next } } });
        return (
          <div key={key} className="admin-stack">
            <LocaleField
              id={idFor(key)}
              label={P.facts[key]}
              value={fact.value}
              onChange={(value) => set({ value })}
              path={key}
              errors={errors}
              multiline={key === "format"}
            />
            <StatusSelect
              id={idFor(`${key}-status`)}
              field={P.facts[key]}
              value={fact.status}
              onChange={(status) => set({ status })}
            />
          </div>
        );
      })}
    </FieldGroup>
  );
}
