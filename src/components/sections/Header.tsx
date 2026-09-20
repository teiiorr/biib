"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AppearanceMenu } from "./AppearanceMenu";
import { LocaleMenu } from "./LocaleMenu";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";
import { Link, usePathname } from "@/i18n/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { onVideoPlaying } from "@/lib/video-signal";
import { cn } from "@/lib/cn";

/**
 * Sahifa nomi barga köçirilmaydi: bar hamişa brend lokapini körsatib
 * turadi, ikkinçi sarlavha esa §12 dagi takror funksiya bölardi.
 */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const sentinel = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(sentinel);
  const [overVideo, setOverVideo] = useState(false);

  useEffect(() => onVideoPlaying(setOverVideo), []);

  return (
    <>
      {/* Skroll çegarasi. Oqimdagi 1 px — bar yopişqoq, bu esa köçadi. */}
      <div ref={sentinel} aria-hidden="true" className="h-px" />

      <header
        data-scrolled={scrolled ? "true" : undefined}
        data-over-video={overVideo ? "true" : undefined}
        className="app-bar"
      >
        <div className="page flex h-16 items-center gap-2 md:h-[68px]">
          <Logo />

          {/* Yettita band uzun tarjimalarda 1024 da ikki qatorga tuşadi, şuning uçun xl dan. */}
          <nav aria-label={t("primary")} className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "tap flex h-10 items-center whitespace-nowrap rounded-sm px-3 text-callout font-medium",
                        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
                        active
                          ? "bg-accent-wash text-accent-text"
                          : "text-label-secondary hover:bg-fill-secondary hover:text-label",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 xl:ml-3">
            <LocaleMenu />
            <AppearanceMenu />
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
