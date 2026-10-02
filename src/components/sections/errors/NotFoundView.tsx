"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { ErrorView } from "@/components/layout/ErrorView";
import { LinkButton } from "@/components/ui/LinkButton";
import { readErrorsCopy } from "@/i18n/errors-copy";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

const subscribeNever = (): (() => void) => () => undefined;

/**
 * 404 xato qobigʻida mijozda chiziladi va Next metadata sarlavhasi boʻsh qoladi, shuning uchun <title>
 * shu yerda beriladi (React uni <head> ichiga koʻtaradi).
 */
export function NotFoundView() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  // Gidratsiya mos kelishi uchun tashqi doʻkon: serverda boʻsh, brauzerda layout ichidagi JSON dan oʻqiladi.
  const copy = useSyncExternalStore(subscribeNever, readErrorsCopy, readErrorsCopy);
  return (
    <>
      {copy.notFound.title ? <title>{copy.notFound.title}</title> : null}
      <ErrorView
        title={copy.notFound.title}
        actions={
          <>
            <LinkButton href={pathFor(locale, "home")} variant="primary">
              {copy.notFound.home}
            </LinkButton>
            <LinkButton href={pathFor(locale, "news")} variant="glass">
              {copy.notFound.news}
            </LinkButton>
          </>
        }
      />
    </>
  );
}
