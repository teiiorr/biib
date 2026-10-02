import type { Localized } from "@/content/types";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import type { TextValue } from "@/i18n/text-overrides";

export function BundledValues({ bundled }: { readonly bundled: Localized<TextValue> }) {
  return (
    <dl className="admin-bundled">
      {LOCALES.map((locale) => {
        const value = bundled[locale];
        const lang = LOCALE_META[locale].htmlLang;
        return (
          <div key={locale} className="admin-bundled-row">
            <dt className="t-small text-ink-3">{LOCALE_META[locale].nativeName}</dt>
            <dd className="t-small text-ink" lang={lang}>
              {typeof value === "string" ? (
                value
              ) : (
                <ul className="admin-bundled-list">
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
