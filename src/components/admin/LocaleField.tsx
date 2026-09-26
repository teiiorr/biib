"use client";

import type { Localized } from "@/content/types";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { FieldErrors } from "@/lib/admin/news/types";
import { isAuto, isDerived } from "@/lib/admin/text/locales";

import { FieldLegend, LocaleModeTag, StalePrompt } from "./LocaleBits";
import { useLocaleEditing } from "./useLocaleEditing";

export interface LocaleFieldProps {
  /** Har til maydonining id si: `${id}-${til}` (xatoga fokus shu orqali). */
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly value: Localized;
  readonly onChange: (next: Localized) => void;
  /** Xato kalitlari `${path}.${til}` shaklida. */
  readonly path: string;
  readonly errors?: FieldErrors;
  /** Tavsiya etilgan uzunlik: hisoblagich, oshsa ogohlantirish (saqlashni toʻxtatmaydi). */
  readonly max?: number;
  readonly multiline?: boolean;
  readonly required?: boolean;
}

/**
 * Besh tilli qisqa maydon: hammasi koʻrinib turadi. Kirill va 2026 qatorlari oʻzbekchadan oʻgiriladi,
 * qoʻlda tuzatilgani esa keyin oʻzbekcha oʻzgarsa ham saqlanadi va qayta oʻgirish taklif qilinadi.
 */
export function LocaleField({
  id,
  label,
  hint,
  value,
  onChange,
  path,
  errors,
  max,
  multiline = false,
  required = false,
}: LocaleFieldProps) {
  const editing = useLocaleEditing(value, onChange);
  const Control = multiline ? Textarea : Input;
  return (
    <fieldset className="admin-locale" aria-describedby={hint ? `${id}-hint` : undefined}>
      <FieldLegend label={label} required={required} />
      {hint ? (
        <p id={`${id}-hint`} className="t-small text-ink-3">
          {hint}
        </p>
      ) : null}
      {LOCALES.map((locale) => {
        const inputId = `${id}-${locale}`;
        const error = errors?.[`${path}.${locale}`];
        const over = max !== undefined && value[locale].length > max;
        const derived = isDerived(locale) ? locale : null;
        const auto = derived ? isAuto(value, derived) : null;
        const stale = derived !== null && auto === false && editing.stale[derived];
        const described = [
          error ? `${inputId}-error` : null,
          over ? `${inputId}-over` : null,
          stale ? `${inputId}-stale` : null,
        ].filter(Boolean);
        return (
          <div key={locale} className="admin-locale-row">
            <div className="admin-locale-head">
              <label htmlFor={inputId} className="t-small text-ink-2">
                {LOCALE_META[locale].nativeName}
              </label>
              {auto === null ? null : <LocaleModeTag auto={auto} />}
              {max !== undefined ? (
                <span className="admin-counter t-micro tnum" data-over={over ? "" : undefined}>
                  {value[locale].length}/{max}
                </span>
              ) : null}
            </div>
            <Control
              id={inputId}
              lang={LOCALE_META[locale].htmlLang}
              value={value[locale]}
              onChange={(event) => editing.change(locale, event.target.value)}
              onBlur={() => editing.tidy(locale)}
              aria-invalid={error ? true : undefined}
              aria-describedby={described.join(" ") || undefined}
              {...(multiline ? { rows: 3 } : { enterKeyHint: "next" as const })}
            />
            {stale && derived ? (
              <StalePrompt
                id={`${inputId}-stale`}
                onRetranslit={() => editing.retranslit(derived)}
              />
            ) : null}
            {over ? (
              <p id={`${inputId}-over`} className="t-small text-ink-2">
                {fill(NEWS_COPY.locale.over, { max: max ?? 0 })}
              </p>
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
