"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { ProjectDraft } from "@/lib/admin/org/project";

import { FieldGroup } from "./FieldGroup";
import type { OrgSectionProps } from "./useOrgEditor";

const P = UPOP_COPY.project;

export function UpopRegisterGroup({ draft, patch, errors, idFor }: OrgSectionProps<ProjectDraft>) {
  return (
    <FieldGroup id={idFor("register-group")} title={P.groups.register}>
      <div className="admin-pair admin-pair-even">
        <Field
          id={idFor("externalHref")}
          label={P.externalHref}
          hint={P.externalHrefHint}
          error={errors.externalHref}
          required
          requiredLabel={ADMIN_COPY.login.required}
        >
          {(control) => (
            <Input
              {...control}
              type="url"
              inputMode="url"
              autoComplete="off"
              value={draft.externalHref}
              onChange={(event) => patch({ externalHref: event.target.value })}
            />
          )}
        </Field>
        <Field
          id={idFor("externalLabel")}
          label={P.externalLabel}
          hint={P.externalLabelHint}
          error={errors.externalLabel}
          required
          requiredLabel={ADMIN_COPY.login.required}
        >
          {(control) => (
            <Input
              {...control}
              autoComplete="off"
              value={draft.externalLabel}
              onChange={(event) => patch({ externalLabel: event.target.value })}
            />
          )}
        </Field>
      </div>
    </FieldGroup>
  );
}
