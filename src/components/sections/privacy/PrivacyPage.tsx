import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Text } from "@/components/ui/Text";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

export function PrivacyPage({ locale, dict }: PageProps) {
  return (
    <>
      <PageHero
        title={dict.privacy.title}
        lead={dict.privacy.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "privacy"), label: dict.nav.privacy, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          <Text as="p" tone="ink-3" size="small">
            {dict.common.status.pending}
          </Text>
        </Container>
      </Section>
    </>
  );
}
