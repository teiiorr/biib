"use client";

import { useState, useTransition } from "react";

import { GlassDropdownMenu, type GlassMenuItem } from "@/components/glass/GlassDropdownMenu";
import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { ActionResult } from "@/lib/admin/db-errors";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";

interface RowMenuProps {
  readonly name: string;
  readonly editHref: string;
  /** Yoʻq boʻlsa «saytda ochish» bandi chiqmaydi. */
  readonly openHref?: string | null;
  readonly deleteTitle: string;
  readonly onDelete: () => Promise<ActionResult>;
  readonly onDeleted: () => void;
}

const L = PEOPLE_COPY.list;

export function RowMenu({
  name,
  editHref,
  openHref = null,
  deleteTitle,
  onDelete,
  onDeleted,
}: RowMenuProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const label = fill(L.menu, { name });

  function remove(): void {
    startTransition(async () => {
      const result = await onDelete();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setConfirming(false);
      onDeleted();
    });
  }

  const items: GlassMenuItem[] = [
    { id: "edit", label: L.edit, href: editHref, icon: <AdminIcon name="pencil" /> },
  ];
  if (openHref) {
    items.push({
      id: "open",
      label: L.open,
      onSelect: () => window.open(openHref, "_blank", "noopener"),
      icon: <AdminIcon name="external" />,
    });
  }
  items.push({
    id: "delete",
    label: L.remove,
    onSelect: () => {
      setError(null);
      setConfirming(true);
    },
    icon: <AdminIcon name="trash" />,
  });

  return (
    <>
      <GlassDropdownMenu
        label={label}
        trigger={
          <Button
            variant="glass"
            size="40"
            iconOnly
            aria-label={label}
            graphic={<AdminIcon name="more" size={16} />}
          />
        }
        items={items}
      />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={deleteTitle}
        text={fill(L.deleteText, { name })}
        confirmLabel={L.remove}
        confirmGraphic={<AdminIcon name="trash" size={20} />}
        onConfirm={remove}
        pending={pending}
        error={error}
        danger
      />
    </>
  );
}
