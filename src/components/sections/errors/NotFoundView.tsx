"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { DesignArt } from "@/components/layout/DesignArt";
import { ErrorView } from "@/components/layout/ErrorView";
import { PalakFallback } from "@/components/layout/PalakFallback";
import { LinkButton } from "@/components/ui/LinkButton";
import { readErrorsCopy } from "@/i18n/errors-copy";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

const subscribeNever = (): (() => void) => () => undefined;

/** 404: Atlas — palak medalyoni (boʻshligʻi bilan), Birlashma — chizish varagʻi (DesignArt not-found). */
export function NotFoundView() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  // Serverda boʻsh, brauzerda layout JSON idan; gidratsiya mos boʻlishi uchun tashqi doʻkon.
  const copy = useSyncExternalStore(subscribeNever, readErrorsCopy, readErrorsCopy);
  return (
    <ErrorView
      title={copy.notFound.title}
      text={copy.notFound.text}
      art={
        <DesignArt
          slot="not-found"
          locale={locale}
          meaningful
          fallback={<PalakFallback />}
          copy={{ canvas: copy.canvas, paints: copy.paints }}
        />
      }
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
