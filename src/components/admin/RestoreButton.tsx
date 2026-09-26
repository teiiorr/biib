"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { restoreEntry } from "@/lib/admin/actions/site";
import { ADMIN_COPY } from "@/lib/admin/copy";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";

interface RestoreButtonProps {
  readonly logId: number;
  readonly summary: string;
}

const J = ADMIN_COPY.journal;

/** Jurnal yozuvini qaytarish: tasdiqdan keyin oldingi holat qayta saqlanadi va saytga chiqadi. */
export function RestoreButton({ logId, summary }: RestoreButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function restore(): void {
    startTransition(async () => {
      const result = await restoreEntry(logId);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setOpen(false);
      setDone(true);
    });
  }

  return (
    <>
      <Button
        variant="glass"
        size="40"
        graphic={<AdminIcon name="undo" size={16} />}
        aria-label={fill(J.restoreLabel, { summary })}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {J.restore}
      </Button>
      {done ? (
        <p className="t-small text-success" role="status">
          {J.restored}
        </p>
      ) : null}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={J.restoreTitle}
        text={fill(J.restoreText, { summary })}
        confirmLabel={J.restore}
        confirmGraphic={<AdminIcon name="undo" size={20} />}
        onConfirm={restore}
        pending={pending}
        error={error}
      />
    </>
  );
}
