"use client";

import { useRef } from "react";

import { useLazyOverlay } from "@/components/glass/useLazyOverlay";

import { LanguageTrigger, type LanguageMenuProps } from "./LanguageTrigger";

const loadPanel = () => import("./LanguageMenuPanel");

/** Til almashtirgich: tugma HTML da, menyu (Radix) boʻsh vaqtda yoki bosilganda yuklanadi. */
export function LanguageMenu({ locale, dict }: LanguageMenuProps) {
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadPanel,
    shellRef,
  );
  if (Panel) {
    return <Panel locale={locale} dict={dict} initialOpen={wantOpen} focusTrigger={restoreFocus} />;
  }
  return (
    <LanguageTrigger
      ref={shellRef}
      locale={locale}
      dict={dict}
      aria-haspopup="menu"
      aria-expanded={false}
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocus={warm}
      onClick={openWhenReady}
    />
  );
}
