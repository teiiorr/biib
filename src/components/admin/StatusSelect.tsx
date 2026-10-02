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
  /** Berilsa yorliq «Manzil: holati», aks holda «Holati» (qator oʻz guruhida turadi). */
  readonly field?: string;
  readonly value: ContentStatus;
  readonly onChange: (status: ContentStatus) => void;
}

/** Tanlash roʻyxati: har maydon ostidagi uchta radio juda koʻp joy olardi. */
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
