"use client";

import type { ButtonHTMLAttributes, Ref } from "react";

import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { LOCALE_META, type Locale } from "@/i18n/locales";

export interface LanguageMenuProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
}

interface LanguageTriggerProps
  extends LanguageMenuProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Til tugmasi: panel kelguncha oddiy, keyin Radix Trigger ichida — bir xil koʻrinish. */
export function LanguageTrigger({ locale, dict, ref, ...rest }: LanguageTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="nav-item t-label"
      aria-label={`${dict.language}: ${LOCALE_META[locale].nativeName}`}
      data-testid="language-open"
      {...rest}
    >
      <Icon name="language" size={20} />
      <span className="text-trim" aria-hidden="true">
        {LOCALE_META[locale].shortName}
      </span>
    </button>
  );
}
