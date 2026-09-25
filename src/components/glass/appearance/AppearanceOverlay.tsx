"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useIsDesktop } from "@/lib/appearance/media";

import { GlassPopover } from "../GlassPopover";
import { useFocusTrigger } from "../useLazyOverlay";
import { GlassSheet } from "../GlassSheet";
import { AppearancePanel } from "./AppearancePanel";
import type { AppearanceControlProps } from "./AppearanceControl";

export interface AppearanceOverlayProps extends AppearanceControlProps {
  readonly initialOpen: boolean;
  readonly focusTrigger: boolean;
}

/** Koʻrinish paneli: kompyuterda popover, telefonda pastki varaq. Ikkalasi ham oyna. */
export default function AppearanceOverlay({
  dict,
  initialOpen,
  focusTrigger,
}: AppearanceOverlayProps) {
  const [open, setOpen] = useState(initialOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  useFocusTrigger(triggerRef, focusTrigger && !initialOpen);
  const desktop = useIsDesktop();

  const trigger = (
    <Button
      ref={(node) => {
        triggerRef.current = node;
      }}
      variant="glass"
      size="48"
      icon="sliders"
      iconOnly
      aria-label={dict.open}
      aria-expanded={open}
      data-testid="appearance-open"
      onClick={() => setOpen((v) => !v)}
    />
  );

  if (desktop) {
    return (
      <GlassPopover
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        morphFrom={triggerRef}
        label={dict.panel}
        padding={16}
      >
        <p className="t-h4 text-material-ink appearance-title">{dict.panel}</p>
        <AppearancePanel dict={dict} />
      </GlassPopover>
    );
  }
  return (
    <GlassSheet
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      morphFrom={triggerRef}
      title={dict.panel}
      closeLabel={dict.close}
    >
      <AppearancePanel dict={dict} />
    </GlassSheet>
  );
}
