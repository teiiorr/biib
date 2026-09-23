"use client";

import { usePathname } from "next/navigation";

import { GlassDropdownMenu, type GlassMenuItem } from "@/components/glass/GlassDropdownMenu";
import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { alternatesFor, pathFor, resolvePath } from "@/i18n/routes";

interface LanguageMenuProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
}

/** Til almashtirgich: shu sahifa va slugni saqlaydi; har band oʻz tilini eʼlon qiladi. */
export function LanguageMenu({ locale, dict }: LanguageMenuProps) {
  const pathname = usePathname();
  const resolved = resolvePath(pathname);
  const alternates = resolved
    ? alternatesFor(resolved.key, resolved.slug)
    : Object.fromEntries(LOCALES.map((l) => [l, pathFor(l, "home")]));

  const items: GlassMenuItem[] = LOCALES.map((l) => ({
    id: l,
    label: LOCALE_META[l].nativeName,
    hint: LOCALE_META[l].shortName,
    href: alternates[l] ?? pathFor(l, "home"),
    current: l === locale,
    lang: LOCALE_META[l].htmlLang,
    hrefLang: LOCALE_META[l].htmlLang,
  }));

  return (
    <GlassDropdownMenu
      label={dict.chooseLanguage}
      items={items}
      testId="language-menu"
      currentLabel={dict.currentLanguage}
      trigger={
        <button
          type="button"
          className="nav-item t-label"
          aria-label={`${dict.language}: ${LOCALE_META[locale].nativeName}`}
          data-testid="language-open"
        >
          <Icon name="language" size={20} />
          <span className="text-trim" aria-hidden="true">
            {LOCALE_META[locale].shortName}
          </span>
        </button>
      }
    />
  );
}
