"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassDropdownMenu, type GlassMenuItem } from "@/components/glass/GlassDropdownMenu";
import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor, resolvePath, type PageKey } from "@/i18n/routes";

interface DesktopNavProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
}

const ABOUT_GROUP: readonly PageKey[] = ["about", "leadership", "experts", "partners"];
const PRIMARY: readonly PageKey[] = ["projects", "news", "contacts"];

/** Kompyuter navigatsiyasi: bitta oyna kapsulasi, ichida bir guruh boshqaruv (oyna ustiga oyna yoʻq). */
export function DesktopNav({ locale, dict }: DesktopNavProps) {
  const pathname = usePathname();
  const current = resolvePath(pathname)?.key ?? "home";
  const aboutActive = ABOUT_GROUP.includes(current);
  const aboutItems: GlassMenuItem[] = ABOUT_GROUP.map((key) => ({
    id: key,
    label: dict[key as "about"],
    href: pathFor(locale, key),
    current: current === key,
  }));

  return (
    <Surface
      as="nav"
      radius="control"
      padding={8}
      text
      adaptiveTone
      className="header-capsule"
      aria-label={dict.primaryLabel}
    >
      <GlassDropdownMenu
        label={dict.aboutGroupHint}
        items={aboutItems}
        align="start"
        currentLabel={dict.currentLanguage}
        trigger={
          <button
            type="button"
            className="nav-item t-label"
            data-active={aboutActive ? "true" : undefined}
            aria-haspopup="menu"
          >
            <span className="text-trim">{dict.aboutGroup}</span>
            <Icon name="chevron-down" size={16} />
          </button>
        }
      />
      {PRIMARY.map((key) => {
        const active = current === key || (key === "news" && current === "newsItem");
        return (
          <Link
            key={key}
            href={pathFor(locale, key)}
            className="nav-item t-label"
            aria-current={active ? "page" : undefined}
          >
            <span className="text-trim">{dict[key as "projects"]}</span>
          </Link>
        );
      })}
    </Surface>
  );
}
