"use client";

import { useRef } from "react";

import { GlassDropdownMenu, type GlassMenuItem } from "@/components/glass/GlassDropdownMenu";
import { useFocusTrigger } from "@/components/glass/useLazyOverlay";

import { AboutTrigger, type AboutMenuProps } from "./AboutTrigger";

export interface AboutMenuPanelProps extends AboutMenuProps {
  readonly initialOpen: boolean;
  readonly focusTrigger: boolean;
}

/** «Biz haqimizda» guruhi menyusi: trigger paneli ichiga morf boʻladi. */
export default function AboutMenuPanel({
  dict,
  items,
  active,
  initialOpen,
  focusTrigger,
}: AboutMenuPanelProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useFocusTrigger(triggerRef, focusTrigger && !initialOpen);
  const menuItems: GlassMenuItem[] = items.map((item) => ({
    id: item.key,
    label: item.label,
    href: item.href,
    current: item.current,
  }));
  return (
    <GlassDropdownMenu
      label={dict.aboutGroupHint}
      items={menuItems}
      align="start"
      currentLabel={dict.currentLanguage}
      initialOpen={initialOpen}
      trigger={<AboutTrigger ref={triggerRef} dict={dict} active={active} />}
    />
  );
}
