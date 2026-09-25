"use client";

import { useRef } from "react";

import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { MAGNET } from "@/lib/motion/constants";

import { useLazyOverlay } from "../useLazyOverlay";

export interface AppearanceControlProps {
  readonly dict: Dictionary["appearance"];
}

const loadOverlay = () => import("./AppearanceOverlay");

/* Button (variant="glass", size="48", iconOnly) chiqaradigan sinflar bilan aynan bir xil: panel kelib
   oʻz tugmasini qoʻyganda hech narsa siljimaydi. Button bu yerda ishlatilmaydi — u cva va Slot ni
   birinchi yuklanish JS iga olib kirardi. */
const SHELL_CLASS =
  "ui-button relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none material text-material-ink t-label-l";

/** Sarlavhadagi tugma HTML da; panel (Radix, sozlagichlar) boʻsh vaqtda yoki bosilganda yuklanadi. */
export function AppearanceControl({ dict }: AppearanceControlProps) {
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadOverlay,
    shellRef,
  );
  if (Panel) return <Panel dict={dict} initialOpen={wantOpen} focusTrigger={restoreFocus} />;
  return (
    <button
      ref={shellRef}
      type="button"
      className={SHELL_CLASS}
      data-variant="glass"
      data-size="48"
      data-icon="only"
      data-text="true"
      data-magnetic={String(MAGNET.icon)}
      aria-label={dict.open}
      aria-expanded={false}
      aria-haspopup="dialog"
      data-testid="appearance-open"
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocus={warm}
      onClick={openWhenReady}
    >
      <Icon name="sliders" size={20} />
    </button>
  );
}
