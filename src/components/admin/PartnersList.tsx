"use client";

import Link from "next/link";
import { useId } from "react";

import { FormMessage } from "@/components/ui/FormMessage";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";
import { pathFor } from "@/i18n/routes";
import { deletePartner, reorderPartners } from "@/lib/admin/actions/partners";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { PARTNER_GROUPS, type PartnerListRow } from "@/lib/admin/partners/types";

import { LogoTile } from "./LogoTile";
import { STATUS_TONE } from "./NewsTable";
import { OrderButtons } from "./OrderButtons";
import { RowMenu } from "./RowMenu";
import { PARTNER_GROUP_LABELS } from "./PartnerGroupField";
import { focusMoved, useReorder } from "./useReorder";

const L = PEOPLE_COPY.list;
const P = PEOPLE_COPY.partners;

/** Roʻyxat yassi: surish qoʻshni bilan joy almashtiradi va guruh chegarasidan oʻtmaydi. */
export function PartnersList({ rows }: { readonly rows: readonly PartnerListRow[] }) {
  const listId = useId().replace(/:/g, "");
  const reorder = useReorder(rows, reorderPartners);
  const { items } = reorder;

  function shift(index: number, delta: -1 | 1): void {
    const row = items[index];
    const neighbour = items[index + delta];
    if (!row || neighbour?.group !== row.group) return;
    const group = items.filter((item) => item.group === row.group);
    const position = group.indexOf(row) + delta;
    reorder.move(
      index,
      index + delta,
      fill(L.moved, { name: row.name ?? row.key, n: position + 1 }),
    );
    const edge =
      position === 0 ? "down" : position === group.length - 1 ? "up" : delta < 0 ? "up" : "down";
    focusMoved(listId, row.key, edge);
  }

  const groups = PARTNER_GROUPS.map((group) => ({
    group,
    rows: items.flatMap((row, index) => (row.group === group ? [{ row, index }] : [])),
  })).filter((entry) => entry.rows.length > 0);

  return (
    <div className="admin-stack">
      {groups.map(({ group, rows: members }) => (
        <section key={group} className="admin-section" aria-labelledby={`${listId}-${group}`}>
          <h2 id={`${listId}-${group}`} className="t-h3 text-ink">
            {PARTNER_GROUP_LABELS[group]}
          </h2>
          <ol
            className="admin-order"
            aria-label={fill(P.caption, { group: PARTNER_GROUP_LABELS[group] })}
          >
            {members.map(({ row, index }, position) => {
              const name = row.name ?? row.key;
              return (
                <li key={row.key} className="admin-order-row" data-kind="logo">
                  <span className="admin-order-n t-micro tnum" aria-hidden="true">
                    {fill(L.position, { n: position + 1 })}
                  </span>
                  <div className="admin-order-media">
                    <LogoTile item={row.logo} sizes="120px" />
                  </div>
                  <div className="admin-order-text">
                    <Link href={`/admin/hamkorlar/${row.id}`} className="admin-table-link t-body">
                      {name}
                    </Link>
                    {row.logo ? null : <span className="t-small text-ink-3">{P.noLogo}</span>}
                    <span>
                      <Tag tone={STATUS_TONE[row.status]}>{ADMIN_COPY.statuses[row.status]}</Tag>
                    </span>
                  </div>
                  <OrderButtons
                    listId={listId}
                    rowKey={row.key}
                    name={name}
                    first={position === 0}
                    last={position === members.length - 1}
                    onMove={(delta) => shift(index, delta)}
                  />
                  <div className="admin-order-menu">
                    <RowMenu
                      name={name}
                      editHref={`/admin/hamkorlar/${row.id}`}
                      openHref={row.status === "pending" ? null : pathFor("uz", "partners")}
                      deleteTitle={P.deleteTitle}
                      onDelete={() => deletePartner(row.id, row.updatedAt)}
                      onDeleted={() => reorder.drop(row.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <p className="sr-only" role="status">
        {reorder.announcement}
      </p>
      <FormMessage tone="error">{reorder.error}</FormMessage>
    </div>
  );
}
