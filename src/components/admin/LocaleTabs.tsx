"use client";

import type { KeyboardEvent } from "react";

import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";

export interface LocaleTabItem {
  readonly locale: Locale;
  readonly complete: boolean;
  readonly invalid: boolean;
}

interface LocaleTabsProps {
  /** Tab va panel id qiymatlari: `${id}-tab-${til}`, `${id}-panel-${til}`. */
  readonly id: string;
  readonly label: string;
  readonly emptyLabel: string;
  readonly active: Locale;
  readonly items: readonly LocaleTabItem[];
  readonly onSelect: (locale: Locale) => void;
}

/** Chap va oʻng strelka, Home va End bilan fokus koʻchganda tab ham tanlanadi (roving tabindex). */
export function LocaleTabs({ id, label, emptyLabel, active, items, onSelect }: LocaleTabsProps) {
  function move(event: KeyboardEvent<HTMLButtonElement>): void {
    const index = LOCALES.indexOf(active);
    const last = LOCALES.length - 1;
    const target =
      event.key === "ArrowRight"
        ? (index + 1) % LOCALES.length
        : event.key === "ArrowLeft"
          ? (index - 1 + LOCALES.length) % LOCALES.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    const locale = LOCALES[target] ?? "uz";
    onSelect(locale);
    document.getElementById(`${id}-tab-${locale}`)?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className="admin-tabs">
      {items.map(({ locale, complete, invalid }) => {
        const meta = LOCALE_META[locale];
        const selected = locale === active;
        return (
          <button
            key={locale}
            type="button"
            role="tab"
            id={`${id}-tab-${locale}`}
            aria-selected={selected}
            aria-controls={`${id}-panel-${locale}`}
            aria-label={`${meta.nativeName} (${meta.shortName})${complete ? "" : `, ${emptyLabel}`}`}
            tabIndex={selected ? 0 : -1}
            className="admin-tab t-label"
            onClick={() => onSelect(locale)}
            onKeyDown={move}
          >
            <span
              className="admin-tab-dot"
              data-complete={complete ? "" : undefined}
              data-invalid={invalid ? "" : undefined}
              aria-hidden="true"
            />
            <span className="text-trim">{meta.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
