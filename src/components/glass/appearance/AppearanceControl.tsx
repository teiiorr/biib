"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { prefetchDesign } from "@/designs/registry";
import type { Dictionary } from "@/i18n/dictionaries";
import { useAppearance } from "@/lib/appearance/context";
import { useIsDesktop } from "@/lib/appearance/media";

import { GlassPopover } from "../GlassPopover";
import { GlassSheet } from "../GlassSheet";
import { AppearancePanel } from "./AppearancePanel";

export interface AppearanceControlProps {
  readonly dict: Dictionary["appearance"];
}

/** Sarlavhadagi tugma: kompyuterda popover, telefonda pastki varaq. Ikkalasi ham oyna. */
export function AppearanceControl({ dict }: AppearanceControlProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const desktop = useIsDesktop();
  const { appearance } = useAppearance();

  useEffect(() => {
    if (open) prefetchDesign(appearance.design === "atlas" ? "birlashma" : "atlas");
  }, [open, appearance.design]);

  const trigger = (
    <Button
      ref={(node) => {
        triggerRef.current = node;
      }}
      variant="glass"
      size="40"
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
