"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { useLens } from "@/components/motion/useLens";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor, resolvePath, type PageKey } from "@/i18n/routes";

import { MenuSheet } from "./MenuSheet";
import { isMenuPage } from "./MenuTrigger";

interface TabBarProps {
  readonly locale: Locale;
  /* Butun lugʻat emas, faqat kerakli boʻlimlar: RSC yukiga ortiqcha matn kirmaydi. */
  readonly nav: Dictionary["nav"];
  readonly hints: Dictionary["common"]["hints"];
}

type TabKey = "home" | "projects" | "news" | "contacts";

const TABS: ReadonlyArray<{ key: TabKey; icon: IconName }> = [
  { key: "home", icon: "home" },
  { key: "projects", icon: "projects" },
  { key: "news", icon: "news" },
  { key: "contacts", icon: "contact" },
];

/** Tab yorligʻi qisqa («Bosh», «UPOP»): 320 px da ham toʻliq sigʻadi; toʻliq nom aria-label da. */
function tabLabel(nav: Dictionary["nav"], key: TabKey): string {
  if (key === "home") return nav.tabShort.home;
  if (key === "projects") return nav.tabShort.projects;
  return nav[key];
}

/**
 * Suzuvchi tab-bar: pastga aylantirganda joriy belgili kichik kapsulaga yigʻiladi,
 * yuqoriga aylantirganda yoki bosilganda yoyiladi. Linza tanlangan band ostida suriladi.
 * Menyu varagʻidagi sahifalarda «Menyu» faol, xaritada yoʻq yoʻlda (404) hech biri.
 */
export function TabBar({ locale, nav, hints }: TabBarProps) {
  const pathname = usePathname();
  const resolved = resolvePath(pathname);
  const currentKey: PageKey | null =
    resolved?.key === "newsItem" ? "news" : (resolved?.key ?? null);
  const tabIndex = TABS.findIndex((t) => t.key === currentKey);
  const menuActive = isMenuPage(currentKey);
  /* Linza bandlari: toʻrt sahifa va menyu tugmasi (indeks 4). */
  const activeIndex = tabIndex >= 0 ? tabIndex : menuActive ? TABS.length : -1;
  const barRef = useRef<HTMLElement | null>(null);
  const [minimized, setMinimized] = useState(false);
  useLens(barRef, activeIndex);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (delta > 24 && y > 120) setMinimized(true);
        else if (delta < -12 || y < 80) setMinimized(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = tabIndex >= 0 ? TABS[tabIndex] : undefined;
  const miniIcon: IconName = current?.icon ?? "menu";
  const miniLabel = current ? tabLabel(nav, current.key) : menuActive ? nav.menu : nav.tabBarLabel;

  return (
    <div
      className="tab-bar-wrap lg:hidden"
      data-minimized={minimized ? "true" : "false"}
      data-testid="tab-bar"
    >
      <Surface
        ref={barRef}
        as="nav"
        radius="control"
        padding={4}
        text
        adaptiveTone
        className="tab-bar"
        aria-label={nav.tabBarLabel}
      >
        <span className="tab-lens" data-lens="" aria-hidden="true" />
        {TABS.map((tab) => {
          const active = tab.key === currentKey;
          const label = tabLabel(nav, tab.key);
          const full = nav[tab.key];
          return (
            <Link
              key={tab.key}
              href={pathFor(locale, tab.key)}
              className="tab-item"
              data-lens-item=""
              aria-current={active ? "page" : undefined}
              aria-label={full === label ? undefined : full}
            >
              <Icon name={tab.icon} size={24} />
              <span className="tab-label">{label}</span>
            </Link>
          );
        })}
        <MenuSheet locale={locale} dict={nav} hints={hints} current={currentKey} />
      </Surface>
      <Surface
        as="button"
        radius="control"
        padding={0}
        text
        adaptiveTone
        type="button"
        className="tab-mini"
        aria-label={`${nav.tabBarLabel}: ${miniLabel}`}
        aria-hidden={!minimized}
        tabIndex={minimized ? 0 : -1}
        onClick={() => setMinimized(false)}
      >
        <Icon name={miniIcon} size={20} />
        <span className="t-label text-trim">{miniLabel}</span>
      </Surface>
    </div>
  );
}
