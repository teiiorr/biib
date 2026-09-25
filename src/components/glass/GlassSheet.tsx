"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import type { ReactNode, RefObject } from "react";

import { cx } from "@/lib/cx";

import { CloseGlyph } from "./CloseGlyph";
import { Surface, type SurfacePadding } from "./Surface";
import { useMorph } from "./useMorph";

export interface GlassSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly trigger?: ReactNode;
  readonly morphFrom?: RefObject<HTMLElement | null>;
  readonly title: string;
  readonly closeLabel: string;
  /** Sarlavha faqat ekran oʻquvchisi uchun boʻlsa. */
  readonly hideTitle?: boolean;
  readonly padding?: SurfacePadding;
  readonly testId?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Pastdan chiqadigan oyna varagʻi: safe-area hisobga olinadi, fokus ichida qoladi. */
export function GlassSheet({
  open,
  onOpenChange,
  trigger,
  morphFrom,
  title,
  closeLabel,
  hideTitle = false,
  padding = 24,
  testId,
  className,
  children,
}: GlassSheetProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  useMorph(open, morphFrom, panelRef);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="glass-overlay z-overlay" />
        <Dialog.Content asChild aria-describedby="">
          <Surface
            ref={panelRef}
            as="div"
            radius="sheet"
            padding={padding}
            text
            className={cx("surface-morph glass-sheet z-modal safe-bottom", className)}
            data-testid={testId}
          >
            <span className="glass-sheet-grip" aria-hidden="true" />
            <div className="glass-dialog-head">
              <Dialog.Title className={cx("t-h3 text-material-ink", hideTitle && "sr-only")}>
                {title}
              </Dialog.Title>
              <Dialog.Close className="glass-close" aria-label={closeLabel}>
                <CloseGlyph />
              </Dialog.Close>
            </div>
            {children}
          </Surface>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
