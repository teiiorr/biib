"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { GlassSheet } from "@/components/glass/GlassSheet";
import { useFocusTrigger } from "@/components/glass/useLazyOverlay";
import { Icon } from "@/components/icons/Icon";
import { pathFor, type PageKey } from "@/i18n/routes";

import { MenuTrigger, type MenuSheetProps } from "./MenuTrigger";

export interface MenuSheetPanelProps extends MenuSheetProps {
  readonly initialOpen: boolean;
  readonly focusTrigger: boolean;
}

const REST: readonly PageKey[] = ["about", "leadership", "experts", "partners"];

/** Menyu varagʻi: tab-barga sigʻmagan sahifalar va maxfiylik havolasi. */
export default function MenuSheetPanel({
  locale,
  dict,
  hints,
  current,
  initialOpen,
  focusTrigger,
}: MenuSheetPanelProps) {
  const [open, setOpen] = useState(initialOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useFocusTrigger(triggerRef, focusTrigger && !initialOpen);

  return (
    <GlassSheet
      open={open}
      onOpenChange={setOpen}
      morphFrom={triggerRef}
      title={dict.menu}
      closeLabel={dict.closeMenu}
      testId="menu-sheet"
      trigger={
        <MenuTrigger
          ref={triggerRef}
          label={dict.menu}
          openLabel={dict.openMenu}
          aria-expanded={open}
        />
      }
    >
      <ul className="glass-menu" aria-label={dict.otherPages}>
        {REST.map((key) => (
          <li key={key}>
            <Link
              href={pathFor(locale, key)}
              className="glass-menu-item t-label"
              aria-current={current === key ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {dict[key as "about"]}
            </Link>
          </li>
        ))}
        <li>
          <a
            href="https://upop.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-menu-item t-label"
          >
            <span className="glass-menu-text">
              <span>{dict.upop}</span>
              <span className="t-micro glass-menu-hint">{dict.upopHint}</span>
            </span>
            <Icon name="external" size={16} />
            <span className="sr-only">{hints.external}</span>
          </a>
        </li>
        <li>
          <Link
            href={pathFor(locale, "privacy")}
            className="glass-menu-item t-label"
            aria-current={current === "privacy" ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {dict.privacy}
          </Link>
        </li>
      </ul>
    </GlassSheet>
  );
}
