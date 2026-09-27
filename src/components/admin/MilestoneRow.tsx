"use client";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";
import { ORG_COPY } from "@/lib/admin/copy-org";
import type { FieldErrors } from "@/lib/admin/news/types";
import type { MilestoneRow as Row } from "@/lib/admin/org/milestones";

import { AdminIcon } from "./AdminIcon";
import { IconSelect } from "./IconSelect";
import { LocaleField } from "./LocaleField";
import { ReorderButtons } from "./ReorderButtons";
import { StatusSelect } from "./StatusSelect";

interface MilestoneRowProps {
  readonly row: Row;
  readonly index: number;
  readonly count: number;
  readonly errors: FieldErrors;
  readonly idFor: (field: string) => string;
  readonly onChange: (next: Row) => void;
  readonly onMove: (to: number) => void;
  readonly onAnnounce: (text: string) => void;
  readonly onRemove: () => void;
}

const H = ORG_COPY.history;

/** Bitta bosqich kartasi: yil, belgi, holat va besh tilli nom; tartib va oʻchirish tugmalari tepada. */
export function MilestoneRow({
  row,
  index,
  count,
  errors,
  idFor,
  onChange,
  onMove,
  onAnnounce,
  onRemove,
}: MilestoneRowProps) {
  const name = fill(H.row, { n: index + 1 });
  const legendId = idFor(`${row.local}-legend`);
  return (
    <fieldset className="admin-item" aria-labelledby={legendId}>
      <div className="admin-item-head">
        <span id={legendId} className="t-label text-ink">
          {name}
          {row.title.uz ? <span className="text-ink-2">{` · ${row.title.uz}`}</span> : null}
        </span>
        {row.id ? null : <Tag tone="art-3">{H.fresh}</Tag>}
        <span className="admin-row-tools">
          <ReorderButtons
            idAt={(at) => `${idFor("milestone-move")}-${at}`}
            item={row.title.uz || name}
            index={index}
            count={count}
            onMove={onMove}
            onAnnounce={onAnnounce}
          />
          <Button
            variant="glass"
            size="48"
            iconOnly
            aria-label={fill(H.removeLabel, { item: name })}
            className="admin-danger"
            graphic={<AdminIcon name="trash" size={20} />}
            onClick={onRemove}
          />
        </span>
      </div>
      <div className="admin-item-grid">
        <Field
          id={idFor(`${row.local}-year`)}
          label={H.year}
          hint={H.yearHint}
          error={errors[`${row.local}-year`]}
          className="admin-item-year"
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={row.year}
              onChange={(event) => onChange({ ...row, year: event.target.value })}
            />
          )}
        </Field>
        <IconSelect
          id={idFor(`${row.local}-icon`)}
          value={row.icon}
          onChange={(icon) => onChange({ ...row, icon })}
        />
        <StatusSelect
          id={idFor(`${row.local}-status`)}
          value={row.status}
          onChange={(status) => onChange({ ...row, status })}
        />
      </div>
      <LocaleField
        id={idFor(`${row.local}-title`)}
        label={H.title}
        value={row.title}
        onChange={(title) => onChange({ ...row, title })}
        path={`${row.local}-title`}
        errors={errors}
        required
      />
    </fieldset>
  );
}
