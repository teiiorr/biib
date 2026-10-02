"use client";

import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { pathFor } from "@/i18n/routes";
import { deleteMilestone, saveMilestones } from "@/lib/admin/actions/milestones";
import { ORG_COPY } from "@/lib/admin/copy-org";
import {
  buildMilestones,
  emptyRow,
  milestoneErrorOrder,
  milestonesPayload,
  rowFromStored,
  type MilestoneRow as Row,
  type MilestonesDraft,
} from "@/lib/admin/org/milestones";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";
import { MilestoneRow } from "./MilestoneRow";
import { SaveBar } from "./SaveBar";
import { useOrgEditor } from "./useOrgEditor";

const H = ORG_COPY.history;

/**
 * Oʻzgargan qatorlar va tartib birga saqlanadi, saqlangan bosqich esa tasdiqdan keyin darhol bazadan
 * oʻchiriladi.
 */
export function MilestonesEditor({ initial }: { readonly initial: MilestonesDraft }) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const [announcement, setAnnouncement] = useState("");
  const [removing, setRemoving] = useState<Row | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();
  const editor = useOrgEditor({
    action: saveMilestones,
    initial,
    version: null,
    keyOf: (draft) =>
      JSON.stringify(
        draft.rows.map((row) => [row.local, row.year, row.status, row.title, row.icon]),
      ),
    check: (draft) => {
      const built = buildMilestones(draft);
      return built.ok ? {} : built.errors;
    },
    fromSaved: (data) => ({ rows: data.map(rowFromStored) }),
    errorOrder: milestoneErrorOrder,
    idFor,
  });
  const { draft, setDraft, baseline, setBaseline } = editor;
  const rows = draft.rows;

  function change(next: Row): void {
    setDraft((d) => ({ rows: d.rows.map((row) => (row.local === next.local ? next : row)) }));
  }

  function move(from: number, to: number): void {
    setDraft((d) => {
      const next = [...d.rows];
      const [row] = next.splice(from, 1);
      if (row) next.splice(to, 0, row);
      return { rows: next };
    });
  }

  function add(): void {
    const row = emptyRow(`n-${crypto.randomUUID().slice(0, 8)}`);
    setDraft((d) => ({ rows: [...d.rows, row] }));
    setAnnouncement(H.added);
    requestAnimationFrame(() => document.getElementById(idFor(`${row.local}-year`))?.focus());
  }

  /* Bazadan oʻchgan qator asos nusxadan ham olinadi: qolgan tahrirlar saqlanmagan boʻlib qoladi. */
  function drop(local: string): void {
    const without = (d: MilestonesDraft) => ({ rows: d.rows.filter((row) => row.local !== local) });
    setDraft(without);
    setBaseline(without);
    setAnnouncement(H.removed);
    requestAnimationFrame(() => document.getElementById(idFor("add"))?.focus());
  }

  function confirmRemove(): void {
    const row = removing;
    if (!row?.id || !row.updatedAt) return;
    const { id, updatedAt } = row;
    startDelete(async () => {
      const result = await deleteMilestone(id, updatedAt);
      if (!result.ok) {
        setRemoveError(result.message);
        return;
      }
      setRemoving(null);
      drop(row.local);
    });
  }

  return (
    <>
      <form action={editor.formAction} onSubmit={editor.submit} className="admin-editor" noValidate>
        <input
          type="hidden"
          name="payload"
          value={JSON.stringify(milestonesPayload(draft, baseline))}
        />
        <p className="t-small text-ink-3">{H.note}</p>
        {rows.length ? (
          <ol className="admin-items">
            {rows.map((row, index) => (
              <li key={row.local}>
                <MilestoneRow
                  row={row}
                  index={index}
                  count={rows.length}
                  errors={editor.errors}
                  idFor={idFor}
                  onChange={change}
                  onMove={(to) => move(index, to)}
                  onAnnounce={setAnnouncement}
                  onRemove={() => {
                    if (!row.id) return drop(row.local);
                    setRemoveError(null);
                    setRemoving(row);
                  }}
                />
              </li>
            ))}
          </ol>
        ) : (
          <p className="t-body text-ink-2">{H.empty}</p>
        )}
        <p className="sr-only" role="status">
          {announcement}
        </p>
        <div className="admin-actions">
          <Button
            id={idFor("add")}
            variant="glass"
            graphic={<AdminIcon name="plus" size={20} />}
            onClick={add}
          >
            {H.add}
          </Button>
        </div>
        <SaveBar
          message={editor.bar.message}
          tone={editor.bar.tone}
          saving={editor.pending}
          viewHref={pathFor("uz", "about")}
        />
      </form>
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title={H.removeTitle}
        text={fill(H.removeText, { title: removing?.title.uz ?? "" })}
        confirmLabel={H.remove}
        confirmGraphic={<AdminIcon name="trash" size={20} />}
        onConfirm={confirmRemove}
        pending={deleting}
        error={removeError}
        danger
      />
    </>
  );
}
