"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Surface } from "@/components/glass/Surface";
import { useLazyOverlay } from "@/components/glass/useLazyOverlay";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor, resolvePath, type PageKey } from "@/i18n/routes";

import { AboutTrigger, type AboutMenuItem, type NavMarks } from "./AboutTrigger";

interface DesktopNavProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
  readonly marks: NavMarks;
}

const ABOUT_GROUP: readonly PageKey[] = ["about", "leadership", "experts", "partners"];
const PRIMARY: readonly PageKey[] = ["projects", "news", "contacts"];
const loadAboutMenu = () => import("./AboutMenuPanel");

/** Kompyuter navigatsiyasi: bitta oyna kapsulasi, ichida bir guruh boshqaruv (oyna ustiga oyna yoʻq). */
export function DesktopNav({ locale, dict, marks }: DesktopNavProps) {
  const pathname = usePathname();
  const current = resolvePath(pathname)?.key ?? "home";
  const aboutActive = ABOUT_GROUP.includes(current);
  const aboutItems: AboutMenuItem[] = ABOUT_GROUP.map((key) => ({
    key,
    label: dict[key as "about"],
    href: pathFor(locale, key),
    current: current === key,
  }));
  const shellRef = useRef<HTMLButtonElement | null>(null);
  const { Panel, warm, openWhenReady, wantOpen, restoreFocus } = useLazyOverlay(
    loadAboutMenu,
    shellRef,
  );

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
      {Panel ? (
        <Panel
          dict={dict}
          items={aboutItems}
          active={aboutActive}
          marks={marks}
          initialOpen={wantOpen}
          focusTrigger={restoreFocus}
        />
      ) : (
        <AboutTrigger
          ref={shellRef}
          dict={dict}
          active={aboutActive}
          marks={marks}
          aria-expanded={false}
          onPointerEnter={warm}
          onPointerDown={warm}
          onFocus={warm}
          onClick={openWhenReady}
        />
      )}
      {PRIMARY.map((key) => {
        const active = current === key || (key === "news" && current === "newsItem");
        return (
          <Link
            key={key}
            href={pathFor(locale, key)}
            className="nav-item zardozi-host t-label"
            aria-current={active ? "page" : undefined}
          >
            <span className="text-trim">{dict[key as "projects"]}</span>
            {marks.underline}
            {active ? marks.mark : null}
          </Link>
        );
      })}
    </Surface>
  );
}
