"use client";

import { useRef } from "react";

import { useLazyOverlay } from "@/components/glass/useLazyOverlay";

import { MenuTrigger, isMenuPage, type MenuSheetProps } from "./MenuTrigger";

const loadPanel = () => import("./MenuSheetPanel");

/** Tugma darhol HTML ichida keladi, Radix Dialog varagʻi esa brauzer boʻshaganda yoki bosilganda yuklanadi. */
export function MenuSheet(props: MenuSheetProps) {
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadPanel,
    shellRef,
  );
  if (Panel) return <Panel {...props} initialOpen={wantOpen} focusTrigger={restoreFocus} />;
  return (
    <MenuTrigger
      ref={shellRef}
      label={props.dict.menu}
      openLabel={props.dict.openMenu}
      active={isMenuPage(props.current)}
      aria-expanded={false}
      onPointerEnter={warm}
      onPointerDown={warm}
      onFocus={warm}
      onClick={openWhenReady}
    />
  );
}
