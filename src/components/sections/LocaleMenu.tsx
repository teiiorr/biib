"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "@/components/brand/Icon";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/Menu";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Beş til bitta röyxatda. Yöl saqlanadi: /uz/yangiliklar → /ru/novosti. */
export function LocaleMenu({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const active = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  function select(next: Locale) {
    if (next === active) return;
    startTransition(() => {
      // params dinamik segmentlar uçun: /news/[slug] toʻgʻri köçadi.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace({ pathname, params: params as any }, { locale: next });
    });
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={t("label")}
        disabled={pending}
        className={cn(
          "tap inline-flex h-10 items-center gap-1.5 rounded-sm px-2.5 text-label",
          "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary",
          "data-[state=open]:bg-fill-secondary",
          className,
        )}
      >
        <Icon name="globe" className="h-[1.15rem] w-[1.15rem]" />
        <span className="text-footnote font-semibold">{LOCALE_META[active].shortName}</span>
      </MenuTrigger>

      <MenuContent>
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const current = code === active;
          return (
            <MenuItem key={code} lang={code} selected={current} onSelect={() => select(code)}>
              <span>{meta.nativeName}</span>
              {current ? (
                <Icon name="check" className="h-4 w-4 text-accent-text" />
              ) : (
                <span className="text-caption text-label-secondary">{meta.shortName}</span>
              )}
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
}
