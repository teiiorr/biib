"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { GlassSheet } from "@/components/glass/GlassSheet";
import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor, type PageKey } from "@/i18n/routes";

interface MenuSheetProps {
  readonly locale: Locale;
  readonly dict: Dictionary["nav"];
  readonly hints: Dictionary["common"]["hints"];
  readonly current: PageKey;
}

const REST: readonly PageKey[] = ["about", "leadership", "experts", "partners"];

/** Menyu varagʻi: tab-barga sigʻmagan sahifalar va maxfiylik havolasi. */
export function MenuSheet({ locale, dict, hints, current }: MenuSheetProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <GlassSheet
      open={open}
      onOpenChange={setOpen}
      morphFrom={triggerRef}
      title={dict.menu}
      closeLabel={dict.closeMenu}
      testId="menu-sheet"
      trigger={
        <button
          ref={(node) => {
            triggerRef.current = node;
          }}
          type="button"
          className="tab-item"
          data-lens-item=""
          aria-label={dict.openMenu}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <Icon name="menu" size={24} />
          <span className="tab-label">{dict.menu}</span>
        </button>
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
