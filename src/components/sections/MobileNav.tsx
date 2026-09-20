"use client";

import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { Icon } from "@/components/brand/Icon";
import { OrnamentBand } from "@/components/brand/Ornament";
import { Sheet } from "@/components/ui/Sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/cn";

/**
 * Yönaliş bandi yettita — beştadan köp, şuning uçun pastki tab-bar emas,
 * şit (§6.2). Şit darvoza kabi oçiladi: bandlar ketma-ket kötariladi
 * (.sheet-item), faol sahifa oltin ustunça bilan belgilanadi, pastda
 * girih medaloni — menyu ham marosim qismi.
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

      <Sheet open={open} onOpenChange={setOpen} title={t("menuTitle")} closeLabel={t("closeMenu")}>
        <nav aria-label={t("primary")}>
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item, index) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="sheet-item" style={{ "--i": index } as CSSProperties}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-12 items-center justify-between gap-3 rounded-sm px-3 text-headline",
                      "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary",
                      active
                        ? [
                            "bg-accent-wash text-accent-text",
                            "before:absolute before:inset-y-2 before:left-0 before:w-0.5",
                            "before:rounded-pill before:bg-[image:var(--metal)] before:content-['']",
                          ]
                        : "text-label",
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

        {/* Marosim tugallovi: girih medalonli oltin çiziq. */}
        <div className="sheet-item mt-5" style={{ "--i": NAV_ITEMS.length } as CSSProperties}>
          <OrnamentBand />
        </div>
      </Sheet>
    </>
  );
}
