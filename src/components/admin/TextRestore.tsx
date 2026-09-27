"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { restoreText } from "@/lib/admin/actions/texts";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";

interface TextRestoreProps {
  readonly textKey: string;
  /** Almashtirish oʻchgach: tahrir maydoni asl matnga qaytadi. */
  readonly onRestored: () => void;
}

const T = SYSTEM_COPY.texts;

/** Oʻzgartirilgan matn belgisi va «Asliga qaytarish» (tasdiq bilan). */
export function TextRestore({ textKey, onRestored }: TextRestoreProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function restore(): void {
    startTransition(async () => {
      const result = await restoreText(textKey);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setOpen(false);
      onRestored();
    });
  }

  return (
    <div className="admin-text-status">
      <Tag tone="accent">{T.changed}</Tag>
      <p className="t-small text-ink-2">{T.overridden}</p>
      <Button
        variant="glass"
        size="40"
        className="admin-text-restore"
        graphic={<AdminIcon name="undo" size={16} />}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        data-testid="admin-text-restore"
      >
        {T.restore}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={T.restoreTitle}
        text={T.restoreText}
        confirmLabel={T.restore}
        confirmGraphic={<AdminIcon name="undo" size={20} />}
        onConfirm={restore}
        pending={pending}
        error={error}
      />
    </div>
  );
}
