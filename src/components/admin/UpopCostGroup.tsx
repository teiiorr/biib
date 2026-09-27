"use client";

import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { CostChoice, ProjectDraft } from "@/lib/admin/org/project";

import { ChoiceField, type ChoiceOption } from "./ChoiceField";
import { FieldGroup } from "./FieldGroup";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const P = UPOP_COPY.project;

/* Uch holat: bepul, pullik va hali nomaʼlum (bazada true, false va null). */
const OPTIONS: readonly ChoiceOption<CostChoice>[] = (["free", "paid", "unknown"] as const).map(
  (value) => ({ value, label: P.costOptions[value], hint: P.costHints[value] }),
);

/** Ishtirok narxi va uning holati. */
export function UpopCostGroup({ draft, patch, idFor }: OrgSectionProps<ProjectDraft>) {
  return (
    <FieldGroup id={idFor("cost-group")} title={P.groups.cost}>
      <ChoiceField
        id={idFor("cost")}
        legend={P.cost}
        value={draft.cost}
        options={OPTIONS}
        onChange={(cost) => patch({ cost })}
      />
      <StatusSelect
        id={idFor("cost-status")}
        field={P.cost}
        value={draft.costStatus}
        onChange={(costStatus) => patch({ costStatus })}
      />
    </FieldGroup>
  );
}
