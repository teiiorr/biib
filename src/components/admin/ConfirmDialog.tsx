"use client";

import type { ReactNode } from "react";

import { GlassDialog } from "@/components/glass/GlassDialog";
import { GlassSheet } from "@/components/glass/GlassSheet";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { useIsDesktop } from "@/lib/appearance/media";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { cx } from "@/lib/cx";

export interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  /** Nima boʻlishini aniq aytadigan bir-ikki gap, dialog tavsifi sifatida oʻqiladi. */
  readonly text: string;
  readonly confirmLabel: string;
  readonly confirmGraphic?: ReactNode;
  readonly onConfirm: () => void;
  readonly pending: boolean;
  readonly error?: string | null;
  /** Qaytarib boʻlmaydigan amal: tasdiq yorligʻi xato rangida, alohida tugma turi kerak emas. */
  readonly danger?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  text,
  confirmLabel,
  confirmGraphic,
  onConfirm,
  pending,
  error = null,
  danger = false,
}: ConfirmDialogProps) {
  const desktop = useIsDesktop();
  const body = (
    <div className="admin-confirm">
      {desktop ? null : <p className="t-body text-material-ink">{text}</p>}
      <FormMessage tone="error">{error}</FormMessage>
      <div className="admin-actions">
        <Button variant="glass" size="48" onClick={() => onOpenChange(false)}>
          {ADMIN_COPY.common.cancel}
        </Button>
        <Button
          variant="glass"
          size="48"
          className={cx(danger && "admin-danger")}
          loading={pending}
          onClick={onConfirm}
          {...(confirmGraphic ? { graphic: confirmGraphic } : {})}
          data-testid="admin-confirm"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
  const shared = { open, onOpenChange, title, closeLabel: ADMIN_COPY.common.close };
  return desktop ? (
    <GlassDialog {...shared} description={text}>
      {body}
    </GlassDialog>
  ) : (
    <GlassSheet {...shared}>{body}</GlassSheet>
  );
}
