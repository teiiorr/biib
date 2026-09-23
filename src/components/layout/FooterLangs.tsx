"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { alternatesFor, pathFor, resolvePath } from "@/i18n/routes";

interface FooterLangsProps {
  readonly locale: Locale;
  readonly label: string;
}

/** Futerdagi til roʻyxati: shu sahifaning boshqa tillardagi manzillari. */
export function FooterLangs({ locale, label }: FooterLangsProps) {
  const resolved = resolvePath(usePathname());
  const alternates = resolved ? alternatesFor(resolved.key, resolved.slug) : null;
  return (
    <nav className="footer-langs" aria-label={label}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={alternates?.[l] ?? pathFor(l, "home")}
          lang={LOCALE_META[l].htmlLang}
          hrefLang={LOCALE_META[l].htmlLang}
          aria-current={l === locale ? "true" : undefined}
        >
          {LOCALE_META[l].nativeName}
        </Link>
      ))}
    </nav>
  );
}
