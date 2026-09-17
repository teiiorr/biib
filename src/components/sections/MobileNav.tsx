"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/cn";

/**
 * Yönaliş bandi yettita — beştadan köp, şuning uçun pastki tab-bar emas,
 * şit (§6.2). Bir detent: röyxatning tabiiy balandligi bitta.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className={cn(
          "tap grid h-10 w-10 place-items-center rounded-sm text-label xl:hidden",
          "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary",
        )}
      >
        <Icon name="menu" className="h-[1.3rem] w-[1.3rem]" />
      </button>

      <Sheet open={open} onOpenChange={setOpen} title={t("menuTitle")}>
        <nav aria-label={t("primary")}>
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between gap-3 rounded-sm px-3 text-headline",
                      "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary",
                      active ? "text-accent-text" : "text-label",
                    )}
                  >
                    {t(item.key)}
                    {active ? <Icon name="check" className="h-4 w-4" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Sheet>
    </>
  );
}
