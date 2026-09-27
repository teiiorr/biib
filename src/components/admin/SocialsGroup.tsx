"use client";

import { useState } from "react";

import { Icon } from "@/components/icons/Icon";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ORG_COPY } from "@/lib/admin/copy-org";
import type { ContactsDraft } from "@/lib/admin/org/contacts";
import type { SocialAdmin } from "@/lib/admin/org/types";

import { FieldGroup } from "./FieldGroup";
import { ReorderButtons } from "./ReorderButtons";
import { StatusSelect } from "./StatusSelect";
import type { OrgSectionProps } from "./useOrgEditor";

const C = ORG_COPY.contacts;

/**
 * Toʻrtta ijtimoiy tarmoq jadval kabi: har qatorda havola, yorliq, holat va tartib. Havolasi boʻsh
 * tarmoq saytdan olinadi (bazada qatori oʻchadi). Kompyuterda bir qatorda, telefonda karta.
 */
export function SocialsGroup({ draft, patch, errors, idFor }: OrgSectionProps<ContactsDraft>) {
  const [announcement, setAnnouncement] = useState("");
  const list = draft.socials;

  function update(index: number, next: Partial<SocialAdmin>): void {
    patch({ socials: list.map((s, i) => (i === index ? { ...s, ...next } : s)) });
  }

  function move(from: number, to: number): void {
    const next = [...list];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    patch({ socials: next });
  }

  return (
    <FieldGroup id={idFor("socials-group")} title={C.groups.socials}>
      <p className="t-small text-ink-3">{C.socialsHint}</p>
      <ol className="admin-socials">
        {list.map((social, index) => {
          const name = C.networks[social.id];
          const base = idFor(`social-${social.id}`);
          return (
            <li key={social.id}>
              <fieldset className="admin-social">
                <legend className="admin-social-name t-label text-ink">
                  <Icon name={social.id} size={20} />
                  {name}
                </legend>
                <div className="admin-social-fields">
                  <Field
                    id={`${base}-href`}
                    label={C.socialHref}
                    error={errors[`social-${social.id}-href`]}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        type="url"
                        inputMode="url"
                        autoComplete="off"
                        value={social.href}
                        onChange={(event) => update(index, { href: event.target.value })}
                      />
                    )}
                  </Field>
                  <Field
                    id={`${base}-label`}
                    label={C.socialLabel}
                    error={errors[`social-${social.id}-label`]}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        autoComplete="off"
                        value={social.label}
                        onChange={(event) => update(index, { label: event.target.value })}
                      />
                    )}
                  </Field>
                  <StatusSelect
                    id={`${base}-status`}
                    field={name}
                    value={social.status}
                    onChange={(status) => update(index, { status })}
                  />
                  <span className="admin-social-tools">
                    <ReorderButtons
                      idAt={(at) => `${idFor("social-move")}-${at}`}
                      item={name}
                      index={index}
                      count={list.length}
                      onMove={(to) => move(index, to)}
                      onAnnounce={setAnnouncement}
                    />
                  </span>
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>
      <p className="sr-only" role="status">
        {announcement}
      </p>
    </FieldGroup>
  );
}
