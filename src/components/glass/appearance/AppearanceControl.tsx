"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";

import { useLazyOverlay } from "../useLazyOverlay";

export interface AppearanceControlProps {
  readonly dict: Dictionary["appearance"];
}

const loadOverlay = () => import("./AppearanceOverlay");

/** Sarlavhadagi tugma HTML da; panel (Radix, sozlagichlar) boʻsh vaqtda yoki bosilganda yuklanadi. */
export function AppearanceControl({ dict }: AppearanceControlProps) {
  const shellRef = useRef<HTMLElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadOverlay,
    shellRef,
  );
  if (Panel) return <Panel dict={dict} initialOpen={wantOpen} focusTrigger={restoreFocus} />;
  return (
    <Button
      ref={(node) => {
        shellRef.current = node;
      }}
      variant="glass"
      size="48"
      icon="sliders"
      iconOnly
      aria-label={dict.open}
      aria-expanded={false}
      aria-haspopup="dialog"
      data-testid="appearance-open"
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocus={warm}
      onClick={openWhenReady}
    />
  );
}
