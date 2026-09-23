"use client";

import { DesignArt } from "@/components/layout/DesignArt";
import { ErrorView } from "@/components/layout/ErrorView";
import { PalakFallback } from "@/components/layout/PalakFallback";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface ErrorPageViewProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly retry: () => void;
}

export function ErrorPageView({ locale, dict, retry }: ErrorPageViewProps) {
  return (
    <ErrorView
      title={dict.errors.error.title}
      text={dict.errors.error.text}
      art={<DesignArt slot="error" locale={locale} fallback={<PalakFallback />} />}
      actions={
        <>
          <Button variant="primary" onClick={retry}>
            {dict.errors.error.retry}
          </Button>
          <LinkButton href={pathFor(locale, "home")} variant="glass">
            {dict.errors.error.home}
          </LinkButton>
        </>
      }
    />
  );
}
