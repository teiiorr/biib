"use client";

import Link from "next/link";
import { useId } from "react";

import { FormMessage } from "@/components/ui/FormMessage";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Tag } from "@/components/ui/Tag";
import type { PersonKind } from "@/content/types";
import { fill } from "@/i18n/format";
import { deletePerson, reorderPeople } from "@/lib/admin/actions/people";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { PERSON_KINDS, personPublicPath } from "@/lib/admin/people/kinds";
import type { PersonListRow } from "@/lib/admin/people/types";

import { STATUS_TONE } from "./NewsTable";
import { OrderButtons } from "./OrderButtons";
import { RowMenu } from "./RowMenu";
import { focusMoved, useReorder } from "./useReorder";

interface PeopleListProps {
  readonly kind: PersonKind;
  readonly rows: readonly PersonListRow[];
}

const L = PEOPLE_COPY.list;

/**
 * Rahbariyat yoki ekspertlar saytdagi tartibda: portret, ism, lavozim, holat; oʻq tugmalari bilan
 * tartiblash va qator menyusi. Telefonda tugmalar ism ostida, bosh barmoq yetadigan qatorda.
 */
export function PeopleList({ kind, rows }: PeopleListProps) {
  const listId = useId().replace(/:/g, "");
  const reorder = useReorder(rows, (keys) => reorderPeople(kind, keys));
  const { items } = reorder;
  const base = PERSON_KINDS[kind].admin;

  function shift(index: number, delta: -1 | 1): void {
    const row = items[index];
    const to = index + delta;
    if (!row || to < 0 || to >= items.length) return;
    const name = row.name ?? row.role;
    reorder.move(index, to, fill(L.moved, { name, n: to + 1 }));
    const edge = to === 0 ? "down" : to === items.length - 1 ? "up" : delta < 0 ? "up" : "down";
    focusMoved(listId, row.key, edge);
  }

  return (
    <div className="admin-stack">
      <ol className="admin-order" aria-label={PEOPLE_COPY.kinds[kind].caption}>
        {items.map((row, index) => {
          const name = row.name ?? L.noName;
          const label = row.name ?? row.role;
          return (
            <li key={row.key} className="admin-order-row">
              <span className="admin-order-n t-micro tnum" aria-hidden="true">
                {fill(L.position, { n: index + 1 })}
              </span>
              <div className="admin-order-media">
                <PortraitFrame ratio="4:5">
                  {row.photo?.src ? (
                    <Picture
                      src={row.photo.src}
                      image={row.photo.image ?? undefined}
                      alt=""
                      fill
                      sizes="64px"
                    />
                  ) : null}
                </PortraitFrame>
              </div>
              <div className="admin-order-text">
                <Link href={`${base}/${row.id}`} className="admin-table-link t-body">
                  {name}
                </Link>
                <span className="t-small text-ink-3">{row.role}</span>
                <span>
                  <Tag tone={STATUS_TONE[row.status]}>{ADMIN_COPY.statuses[row.status]}</Tag>
                </span>
              </div>
              <OrderButtons
                listId={listId}
                rowKey={row.key}
                name={label}
                first={index === 0}
                last={index === items.length - 1}
                onMove={(delta) => shift(index, delta)}
              />
              <div className="admin-order-menu">
                <RowMenu
                  name={label}
                  editHref={`${base}/${row.id}`}
                  openHref={personPublicPath(kind, row.key)}
                  deleteTitle={PEOPLE_COPY.kinds[kind].deleteTitle}
                  onDelete={() => deletePerson(kind, row.id, row.updatedAt)}
                  onDeleted={() => reorder.drop(row.id)}
                />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="sr-only" role="status">
        {reorder.announcement}
      </p>
      <FormMessage tone="error">{reorder.error}</FormMessage>
    </div>
  );
}
