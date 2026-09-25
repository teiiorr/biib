"use client";

import type { ButtonHTMLAttributes, Ref } from "react";

import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import type { PageKey } from "@/i18n/routes";

export interface MenuSheetProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
  readonly hints: Dictionary["common"]["hints"];
  /** null: xaritada yoʻq yoʻl (404) — hech bir band faol emas. */
  readonly current: PageKey | null;
}

/** Tab-barda oʻz bandi yoʻq sahifalar: ular menyu varagʻida, shu sabab faol band «Menyu». */
export const MENU_PAGES: readonly PageKey[] = [
  "about",
  "leadership",
  "experts",
  "partners",
  "privacy",
];

export function isMenuPage(key: PageKey | null): boolean {
  return key !== null && MENU_PAGES.includes(key);
}

interface MenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly label: string;
  readonly openLabel: string;
  readonly active: boolean;
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Tab-bardagi «Menyu» tugmasi: varaq kelguncha ham, keyin ham bir xil. */
export function MenuTrigger({ label, openLabel, active, ref, ...rest }: MenuTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="tab-item"
      data-lens-item=""
      data-active={active ? "true" : undefined}
      aria-label={openLabel}
      aria-haspopup="dialog"
      {...rest}
    >
      <Icon name="menu" size={24} />
      <span className="tab-label">{label}</span>
    </button>
  );
}
