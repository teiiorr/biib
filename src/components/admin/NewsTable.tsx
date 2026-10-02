import Link from "next/link";

import type { ContentStatus } from "@/content/types";
import { Tag, type TagTone } from "@/components/ui/Tag";
import { formatDate } from "@/i18n/format";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { formatStamp } from "@/lib/admin/format";
import type { NewsListRow } from "@/lib/admin/news/types";

import { NewsRowActions } from "./NewsRowActions";

/** Holat tegi: tasdiqlangan pushti, qoralama neytral, kutilmoqda rangli. */
export const STATUS_TONE: Readonly<Record<ContentStatus, TagTone>> = {
  confirmed: "accent",
  draft: "neutral",
  pending: "art-3",
};

const C = NEWS_COPY.list.columns;

/** 600 px dan tor ekranda har qator kartaga aylanadi, ustun nomi katak oldida yoziladi. */
export function NewsTable({ rows }: { readonly rows: readonly NewsListRow[] }) {
  return (
    <table className="admin-table">
      <caption className="sr-only">{NEWS_COPY.list.caption}</caption>
      <thead>
        <tr>
          <th scope="col">{C.title}</th>
          <th scope="col">{C.status}</th>
          <th scope="col">{C.date}</th>
          <th scope="col">{C.photos}</th>
          <th scope="col">{C.updated}</th>
          <th scope="col">
            <span className="sr-only">{C.actions}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row" className="admin-table-main">
              <Link href={`/admin/yangiliklar/${row.id}`} className="admin-table-link t-body">
                {row.title}
              </Link>
              <span className="admin-table-sub t-micro">/{row.slug}</span>
            </th>
            <td data-label={C.status}>
              <Tag tone={STATUS_TONE[row.status]}>{ADMIN_COPY.statuses[row.status]}</Tag>
            </td>
            <td data-label={C.date} className="tnum">
              {formatDate("uz", row.date)}
            </td>
            <td data-label={C.photos} className="tnum">
              {row.photos}
            </td>
            <td data-label={C.updated} className="tnum">
              {formatStamp(row.updatedAt)}
            </td>
            <td className="admin-table-actions">
              <NewsRowActions
                id={row.id}
                slug={row.slug}
                title={row.title}
                updatedAt={row.updatedAt}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
