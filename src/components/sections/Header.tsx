"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleMenu } from "./LocaleMenu";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/cn";

/**
 * Yopişqoq sarlavha. Skroll boşlansa pastdagi ingiçka çiziq paydo bölad.
 * lg dan pastda — burger, xl dan pastda nom matnsiz.
 */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className={cn(
        "glass sticky top-0 z-[60] border-b transition-colors duration-300 ease-[var(--ease-micro)]",
        scrolled ? "border-b-line" : "border-b-transparent",
      )}
    >
      <div className="page-w page-x flex h-[4.75rem] items-center gap-3">
        <Logo />

        <nav aria-label={t("primary")} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0 xl:gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-11 items-center whitespace-nowrap rounded-btn px-2 2xl:px-3",
                      "font-display text-[0.82rem] font-bold leading-none xl:text-[0.86rem] 2xl:text-[0.92rem]",
                      "transition-colors duration-200 ease-[var(--ease-micro)]",
                      "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
                      active ? "text-blue-deep" : "text-ink-2 hover:text-blue-deep",
                    )}
                  >
                    {t(item.key)}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-2 bottom-1.5 h-[3px] origin-left rounded-full bg-blue-cta",
                        "transition-transform duration-300 ease-[var(--ease-pop)] 2xl:inset-x-3",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <LocaleMenu />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
