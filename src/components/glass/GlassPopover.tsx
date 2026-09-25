"use client";

import * as Popover from "@radix-ui/react-popover";
import { useRef } from "react";
import type { ReactNode, RefObject } from "react";

import { cx } from "@/lib/cx";

import { Surface, type SurfacePadding } from "./Surface";
import { useMorph } from "./useMorph";

export interface GlassPopoverProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Radix Trigger sifatida oʻraladi; `anchor` berilsa tugma tashqarida boshqariladi. */
  readonly trigger?: ReactNode;
  readonly anchor?: ReactNode;
  /** Morf boshlanadigan element (odatda trigger tugma). */
  readonly morphFrom?: RefObject<HTMLElement | null>;
  readonly label: string;
  readonly side?: "top" | "bottom" | "left" | "right";
  readonly align?: "start" | "center" | "end";
  readonly sideOffset?: number;
  readonly padding?: SurfacePadding;
  readonly className?: string;
  readonly children: ReactNode;
}

export function GlassPopover({
  open,
  onOpenChange,
  trigger,
  anchor,
  morphFrom,
  label,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  padding = 16,
  className,
  children,
}: GlassPopoverProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  useMorph(open, morphFrom, panelRef);

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Popover.Trigger asChild>{trigger}</Popover.Trigger> : null}
      {anchor ? <Popover.Anchor asChild>{anchor}</Popover.Anchor> : null}
      <Popover.Portal>
        <Popover.Content
          asChild
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={16}
          aria-label={label}
        >
          <Surface
            ref={panelRef}
            radius="panel"
            padding={padding}
            text
            className={cx("surface-morph glass-popover z-overlay", className)}
          >
            {children}
          </Surface>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
