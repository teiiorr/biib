import type { ContentStatus } from "@/content/types";
import { fill } from "@/i18n/format";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { ORG_COPY } from "@/lib/admin/copy-org";

import { NativeSelect, type SelectOption } from "./NativeSelect";

const OPTIONS: readonly SelectOption<ContentStatus>[] = (
  ["confirmed", "draft", "pending"] as const
).map((value) => ({ value, label: ADMIN_COPY.statuses[value] }));

interface StatusSelectProps {
  readonly id: string;
  /** Qaysi maydonning holati: yorliq «Manzil: holati». Berilmasa «Holati» (qator oʻz guruhida). */
  readonly field?: string;
  readonly value: ContentStatus;
  readonly onChange: (status: ContentStatus) => void;
}

/** Bitta maydon holati: ixcham tanlash roʻyxati (uchta radio har maydon ostida juda koʻp joy olardi). */
export function StatusSelect({ id, field, value, onChange }: StatusSelectProps) {
  return (
    <NativeSelect
      id={id}
      label={field ? fill(ORG_COPY.statusOf, { field }) : ORG_COPY.status}
      value={value}
      options={OPTIONS}
      onChange={onChange}
      className="admin-status-select"
    />
  );
}
