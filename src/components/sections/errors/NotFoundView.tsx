"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { ErrorView } from "@/components/layout/ErrorView";
import { PalakFallback } from "@/components/layout/PalakFallback";
import { LinkButton } from "@/components/ui/LinkButton";
import { readErrorsCopy } from "@/i18n/errors-copy";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

const subscribeNever = (): (() => void) => () => undefined;

/** 404: palak medalyoni (ataylab qoldirilgan boʻshligʻi bilan), sarlavha va ikki havola. */
export function NotFoundView() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  // Serverda boʻsh, brauzerda layout JSON idan; gidratsiya mos boʻlishi uchun tashqi doʻkon.
  const copy = useSyncExternalStore(subscribeNever, readErrorsCopy, readErrorsCopy);
  return (
    <ErrorView
      title={copy.notFound.title}
      text={copy.notFound.text}
      art={<PalakFallback />}
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
  );
}
