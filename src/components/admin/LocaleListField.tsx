"use client";

import { useState } from "react";

import type { Localized } from "@/content/types";
import { FormMessage } from "@/components/ui/FormMessage";
import { Textarea } from "@/components/ui/Textarea";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { FieldErrors } from "@/lib/admin/news/types";
import { isAuto, isDerived, toParagraphs } from "@/lib/admin/text/locales";

import { FieldLegend, LocaleModeTag, StalePrompt } from "./LocaleBits";
import { LocaleTabs } from "./LocaleTabs";
import { useLocaleEditing } from "./useLocaleEditing";

export interface LocaleListFieldProps {
  /** Maydon id qiymati `${id}-${til}`: xatoga fokus yashirin tabni ham ochadi (editor-focus.ts). */
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  /** Har til bitta matn: xatboshilar boʻsh qator bilan ajratilgan. */
  readonly value: Localized;
  readonly onChange: (next: Localized) => void;
  readonly path: string;
  readonly errors?: FieldErrors;
  readonly required?: boolean;
}

const L = NEWS_COPY.locale;

export function LocaleListField({
  id,
  label,
  hint,
  value,
  onChange,
  path,
  errors,
  required = false,
}: LocaleListFieldProps) {
  const [active, setActive] = useState<Locale>("uz");
  const editing = useLocaleEditing(value, onChange);
  return (
    <fieldset className="admin-locale" aria-describedby={`${id}-hint`}>
      <FieldLegend label={label} required={required} />
      <p id={`${id}-hint`} className="t-small text-ink-3">
        {hint}
      </p>
      <LocaleTabs
        id={id}
        label={L.tabs}
        emptyLabel={L.empty}
        active={active}
        onSelect={setActive}
        items={LOCALES.map((locale) => ({
          locale,
          complete: value[locale].trim() !== "",
          invalid: Boolean(errors?.[`${path}.${locale}`]),
        }))}
      />
      {LOCALES.map((locale) => {
        const inputId = `${id}-${locale}`;
        const error = errors?.[`${path}.${locale}`];
        const derived = isDerived(locale) ? locale : null;
        const auto = derived ? isAuto(value, derived) : null;
        const stale = derived !== null && auto === false && editing.stale[derived];
        const described = [error ? `${inputId}-error` : null, stale ? `${inputId}-stale` : null];
        return (
          <div
            key={locale}
            role="tabpanel"
            id={`${id}-panel-${locale}`}
            aria-labelledby={`${id}-tab-${locale}`}
            hidden={locale !== active}
            className="admin-locale-row"
          >
            <div className="admin-locale-head">
              <label htmlFor={inputId} className="t-small text-ink-2">
                {`${label} · ${LOCALE_META[locale].nativeName}`}
              </label>
              {auto === null ? null : <LocaleModeTag auto={auto} />}
              <span className="admin-counter t-micro tnum">
                {fill(NEWS_COPY.editor.paragraphs, { n: toParagraphs(value[locale]).length })}
              </span>
            </div>
            <Textarea
              id={inputId}
              lang={LOCALE_META[locale].htmlLang}
              rows={12}
              value={value[locale]}
              onChange={(event) => editing.change(locale, event.target.value)}
              onBlur={() => editing.tidy(locale)}
              aria-invalid={error ? true : undefined}
              aria-describedby={described.filter(Boolean).join(" ") || undefined}
            />
            {stale && derived ? (
              <StalePrompt
                id={`${inputId}-stale`}
                onRetranslit={() => editing.retranslit(derived)}
              />
            ) : null}
            <FormMessage id={`${inputId}-error`} tone="error">
              {error}
            </FormMessage>
          </div>
        );
      })}
    </fieldset>
  );
}
