"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { DesignArt } from "@/components/layout/DesignArt";
import { ErrorView } from "@/components/layout/ErrorView";
import { PalakFallback } from "@/components/layout/PalakFallback";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { readErrorsCopy } from "@/i18n/errors-copy";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface ErrorPageViewProps {
  readonly retry: () => void;
}

const subscribeNever = (): (() => void) => () => undefined;

export function ErrorPageView({ retry }: ErrorPageViewProps) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const copy = useSyncExternalStore(subscribeNever, readErrorsCopy, readErrorsCopy);
  return (
    <ErrorView
      title={copy.error.title}
      text={copy.error.text}
      art={<DesignArt slot="error" locale={locale} fallback={<PalakFallback />} />}
      actions={
        <>
          <Button variant="primary" onClick={retry}>
            {copy.error.retry}
          </Button>
          <LinkButton href={pathFor(locale, "home")} variant="glass">
            {copy.error.home}
          </LinkButton>
        </>
      }
    />
  );
}
