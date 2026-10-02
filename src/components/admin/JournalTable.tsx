import { ADMIN_COPY } from "@/lib/admin/copy";
import { formatStamp } from "@/lib/admin/format";
import type { JournalRow } from "@/lib/admin/journal";

import { RestoreButton } from "./RestoreButton";

const J = ADMIN_COPY.journal;
const C = J.columns;

function label(map: Readonly<Record<string, string>>, key: string): string {
  return map[key] ?? key;
}

/** 600 px dan tor ekranda jadval qatorlari kartaga aylanadi. */
export function JournalTable({ rows }: { readonly rows: readonly JournalRow[] }) {
  if (!rows.length) return <p className="t-body text-ink-2">{J.empty}</p>;
  return (
    <table className="admin-table">
      <caption className="sr-only">{J.caption}</caption>
      <thead>
        <tr>
          <th scope="col">{C.summary}</th>
          <th scope="col">{C.at}</th>
          <th scope="col">{C.entity}</th>
          <th scope="col">{C.action}</th>
          <th scope="col">
            <span className="sr-only">{C.restore}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row" className="admin-table-main">
              <span className="t-body text-ink">{row.summary}</span>
            </th>
            <td data-label={C.at} className="tnum">
              {formatStamp(row.at)}
            </td>
            <td data-label={C.entity}>{label(J.entities, row.entity)}</td>
            <td data-label={C.action}>{label(J.actions, row.action)}</td>
            <td className="admin-table-actions">
              {row.restorable ? <RestoreButton logId={row.id} summary={row.summary} /> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
