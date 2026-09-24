"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

import { GlassDropdownMenu, type GlassMenuItem } from "@/components/glass/GlassDropdownMenu";
import { useFocusTrigger } from "@/components/glass/useLazyOverlay";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import { alternatesFor, pathFor, resolvePath } from "@/i18n/routes";

import { LanguageTrigger, type LanguageMenuProps } from "./LanguageTrigger";

export interface LanguageMenuPanelProps extends LanguageMenuProps {
  readonly initialOpen: boolean;
  readonly focusTrigger: boolean;
}

/** Til almashtirgich menyusi: shu sahifa va slugni saqlaydi; har band oʻz tilini eʼlon qiladi. */
export default function LanguageMenuPanel({
  locale,
  dict,
  initialOpen,
  focusTrigger,
}: LanguageMenuPanelProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useFocusTrigger(triggerRef, focusTrigger && !initialOpen);
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
      initialOpen={initialOpen}
      trigger={<LanguageTrigger ref={triggerRef} locale={locale} dict={dict} />}
    />
  );
}
