"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "@/components/brand/Icon";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Beş til bitta ixçam röyxatda, faoliga belgi qöyiladi.
 * Yöl saqlanadi: /uz/yangiliklar → /ru/novosti.
 */
export function LocaleMenu({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const active = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function select(next: string) {
    if (next === active) return;
    startTransition(() => {
      router.replace(
        // params dinamik segmentlar uçun — /news/[slug] toğri köçadi.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { pathname, params: params as any },
        { locale: next as Locale },
      );
    });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={t("label")}
        disabled={pending}
        className={cn(
          "group inline-flex h-11 items-center gap-1.5 rounded-btn border border-line px-3",
          "font-display text-[0.92rem] font-bold text-blue-deep",
          "transition-colors duration-200 ease-[var(--ease-micro)]",
          "hover:border-line-strong hover:bg-blue-soft",
          "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
          "data-[state=open]:bg-blue-soft",
          className,
        )}
      >
        <Icon name="globe" className="h-[1.15rem] w-[1.15rem]" />
        <span className="hidden sm:inline">{LOCALE_META[active].shortName}</span>
        <Icon
          name="chevron-down"
          className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className={cn(
            "glass-strong z-[70] min-w-56 rounded-panel p-1.5",
            "data-[state=open]:animate-[menu-in_200ms_var(--ease-pop)]",
          )}
        >
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code];
            const current = code === active;
            return (
              <DropdownMenu.Item
                key={code}
                onSelect={() => select(code)}
                lang={code}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-btn px-3.5 py-2.5",
                  "text-[1rem] text-ink outline-none",
                  "data-[highlighted]:bg-blue-soft data-[highlighted]:text-blue-deep",
                  current && "font-semibold text-blue-deep",
                )}
              >
                <span>{meta.nativeName}</span>
                {current ? (
                  <Icon name="check" className="h-[1.05rem] w-[1.05rem] text-blue-cta" />
                ) : (
                  <span className="text-[0.82rem] font-semibold text-ink-muted">
                    {meta.shortName}
                  </span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
