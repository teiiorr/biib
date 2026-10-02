"use client";

import { useRef } from "react";

import { useLazyOverlay } from "@/components/glass/useLazyOverlay";

import { PersonTrigger, type PersonDialogProps } from "./PersonTrigger";

const loadPanel = () => import("./PersonDialogPanel");

/** Tugma darhol HTML ichida keladi, Radix dialogi esa brauzer boʻshaganda yoki bosilganda yuklanadi. */
export function PersonDialog(props: PersonDialogProps) {
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadPanel,
    shellRef,
  );
  if (Panel) return <Panel {...props} initialOpen={wantOpen} focusTrigger={restoreFocus} />;
  return (
    <PersonTrigger
      ref={shellRef}
      label={props.openLabel}
      aria-expanded={false}
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocus={warm}
      onClick={openWhenReady}
    />
  );
}
