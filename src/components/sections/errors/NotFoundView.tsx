import { DesignArt } from "@/components/layout/DesignArt";
import { ErrorView } from "@/components/layout/ErrorView";
import { PalakFallback } from "@/components/layout/PalakFallback";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface NotFoundViewProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** 404: Atlas — palak medalyoni (boʻshligʻi bilan), Birlashma — chizish varagʻi (DesignArt not-found). */
export function NotFoundView({ locale, dict }: NotFoundViewProps) {
  return (
    <ErrorView
      title={dict.errors.notFound.title}
      text={dict.errors.notFound.text}
      art={<DesignArt slot="not-found" locale={locale} meaningful fallback={<PalakFallback />} />}
      actions={
        <>
          <LinkButton href={pathFor(locale, "home")} variant="primary">
            {dict.errors.notFound.home}
          </LinkButton>
          <LinkButton href={pathFor(locale, "news")} variant="glass">
            {dict.errors.notFound.news}
          </LinkButton>
        </>
      }
    />
  );
}
