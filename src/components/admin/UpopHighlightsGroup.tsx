"use client";

import { useState } from "react";

import { highlightIcon } from "@/components/sections/home/upop-highlight-icons";
import { Button } from "@/components/ui/Button";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import { HIGHLIGHT_MAX, type ProjectDraft } from "@/lib/admin/org/project";
import { emptyLocalized } from "@/lib/admin/text/locales";

import { AdminIcon } from "./AdminIcon";
import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { ReorderButtons } from "./ReorderButtons";
import type { OrgSectionProps } from "./useOrgEditor";

const P = UPOP_COPY.project;

/** Har dalil bitta besh tilli maydon, shu sabab tillar orasida soni doim teng. */
export function UpopHighlightsGroup({
  draft,
  patch,
  errors,
  idFor,
}: OrgSectionProps<ProjectDraft>) {
  const [announcement, setAnnouncement] = useState("");
  const list = draft.highlights;
  const full = list.length >= HIGHLIGHT_MAX;

  function move(from: number, to: number): void {
    const next = [...list];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    patch({ highlights: next });
  }

  function add(): void {
    const local = `h-${crypto.randomUUID().slice(0, 8)}`;
    patch({ highlights: [...list, { local, text: emptyLocalized() }] });
    requestAnimationFrame(() => document.getElementById(`${idFor(local)}-uz`)?.focus());
  }

  return (
    <FieldGroup id={idFor("highlights-group")} title={P.groups.highlights}>
      <p className="t-small text-ink-3">{P.highlightsHint}</p>
      <ol className="admin-items">
        {list.map((item, index) => {
          const name = fill(P.highlight, { n: index + 1 });
          const headId = idFor(`${item.local}-head`);
          return (
            <li key={item.local}>
              <fieldset className="admin-item" aria-labelledby={headId}>
                <div className="admin-item-head">
                  <FeatureIcon name={highlightIcon(index)} />
                  <span id={headId} className="t-label text-ink">
                    {name}
                  </span>
                  <span className="admin-row-tools">
                    <ReorderButtons
                      idAt={(at) => `${idFor("highlight-move")}-${at}`}
                      item={item.text.uz || name}
                      index={index}
                      count={list.length}
                      onMove={(to) => move(index, to)}
                      onAnnounce={setAnnouncement}
                    />
                    <Button
                      variant="glass"
                      size="48"
                      iconOnly
                      aria-label={fill(P.highlightRemove, { n: index + 1 })}
                      graphic={<AdminIcon name="trash" size={20} />}
                      onClick={() =>
                        patch({ highlights: list.filter((h) => h.local !== item.local) })
                      }
                    />
                  </span>
                </div>
                <LocaleField
                  id={idFor(item.local)}
                  label={P.highlightText}
                  value={item.text}
                  onChange={(text) =>
                    patch({
                      highlights: list.map((h) => (h.local === item.local ? { ...h, text } : h)),
                    })
                  }
                  path={item.local}
                  errors={errors}
                  required
                />
              </fieldset>
            </li>
          );
        })}
      </ol>
      <p className="sr-only" role="status">
        {announcement}
      </p>
      <div className="admin-actions">
        <Button
          variant="glass"
          graphic={<AdminIcon name="plus" size={20} />}
          disabled={full}
          {...(full ? { disabledReason: P.highlightMax } : {})}
          onClick={add}
        >
          {P.highlightAdd}
        </Button>
      </div>
    </FieldGroup>
  );
}
