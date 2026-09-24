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
  readonly current: PageKey;
}

interface MenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly label: string;
  readonly openLabel: string;
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Tab-bardagi «Menyu» tugmasi: varaq kelguncha ham, keyin ham bir xil. */
export function MenuTrigger({ label, openLabel, ref, ...rest }: MenuTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="tab-item"
      data-lens-item=""
      aria-label={openLabel}
      aria-haspopup="dialog"
      {...rest}
    >
      <Icon name="menu" size={24} />
      <span className="tab-label" data-clamp="">
        {label}
      </span>
    </button>
  );
}
