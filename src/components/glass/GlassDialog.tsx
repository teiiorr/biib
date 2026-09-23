"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import type { ReactNode, RefObject } from "react";

import { cn } from "@/lib/cn";

import { CloseGlyph } from "./CloseGlyph";
import { Surface, type SurfacePadding } from "./Surface";
import { useMorph } from "./useMorph";

export interface GlassDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly trigger?: ReactNode;
  readonly morphFrom?: RefObject<HTMLElement | null>;
  readonly title: string;
  readonly description?: string;
  readonly closeLabel: string;
  readonly padding?: SurfacePadding;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Markazdagi oyna dialogi (kompyuter). Telefonda GlassSheet ishlatiladi. */
export function GlassDialog({
  open,
  onOpenChange,
  trigger,
  morphFrom,
  title,
  description,
  closeLabel,
  padding = 24,
  className,
  children,
}: GlassDialogProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  useMorph(open, morphFrom, panelRef);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="glass-overlay z-overlay" />
        <Dialog.Content asChild aria-describedby={description ? undefined : ""}>
          <Surface
            ref={panelRef}
            as="div"
            radius="panel"
            padding={padding}
            text
            tape
            className={cn("surface-morph glass-dialog z-modal", className)}
          >
            <div className="glass-dialog-head">
              <Dialog.Title className="t-h3 text-material-ink">{title}</Dialog.Title>
              <Dialog.Close className="glass-close" aria-label={closeLabel}>
                <CloseGlyph />
              </Dialog.Close>
            </div>
            {description ? (
              <Dialog.Description className="t-small glass-dialog-description">
                {description}
              </Dialog.Description>
            ) : null}
            {children}
          </Surface>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
