"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { Doodle } from "@/components/brand/Doodle";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/cn";

/**
 * Töliq ekranli menyu. Radix fokusni ipatib turadi va Escape ni tutadi.
 * Bandlar ketma-ket çiqadi, bosiş maydoni 56 px.
 */
export function MobileMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={t("openMenu")}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-btn border border-line text-blue-deep lg:hidden",
          "transition-colors duration-200 ease-[var(--ease-micro)]",
          "hover:border-line-strong hover:bg-blue-soft",
          "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
        )}
      >
        <Icon name="menu" className="h-[1.4rem] w-[1.4rem]" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[var(--bg)]/70 data-[state=open]:animate-[veil-in_180ms_ease-out]" />
        <Dialog.Content
          className={cn(
            "glass-strong fixed inset-0 z-[85] flex flex-col overflow-y-auto",
            "data-[state=open]:animate-[veil-in_200ms_ease-out]",
          )}
        >
          <Dialog.Title className="sr-only">{t("menuTitle")}</Dialog.Title>

          <div className="page-x flex h-[4.75rem] shrink-0 items-center justify-end">
            <Dialog.Close
              aria-label={t("closeMenu")}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-btn border border-line text-blue-deep",
                "transition-colors duration-200 hover:border-line-strong hover:bg-blue-soft",
                "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
              )}
            >
              <Icon name="close" className="h-[1.4rem] w-[1.4rem]" />
            </Dialog.Close>
          </div>

          <nav className="page-x flex flex-1 flex-col justify-center gap-1 pb-16">
            {NAV_ITEMS.map((item, index) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{ animationDelay: `${70 + index * 55}ms` }}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-btn px-2 py-2",
                    "font-display text-[1.6rem] font-bold leading-tight",
                    "opacity-0 [animation-fill-mode:forwards]",
                    "animate-[pop-in_460ms_var(--ease-pop)_forwards]",
                    "motion-reduce:animate-none motion-reduce:opacity-100",
                    active ? "text-blue-deep" : "text-ink",
                    "hover:bg-blue-soft focus-visible:bg-blue-soft",
                  )}
                >
                  {active ? (
                    <Doodle name="spark" className="h-5 w-5 text-sun" strokeWidth={2} />
                  ) : null}
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
