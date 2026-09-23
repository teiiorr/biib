import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface HomePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Vaqtinchalik bosh sahifa: matn birinchi kadrda koʻrinadi; Darvoza sahnasi keyingi bosqichda. */
export function HomePage({ locale, dict }: HomePageProps) {
  return (
    <>
      <Section tone="light" labelledBy="hero-title" className="min-h-[100svh] flex items-end">
        <Container className="grid gap-6 pb-12">
          <Heading level={1} size="display-xl" id="hero-title">
            {dict.common.brand.name}
          </Heading>
          <Text as="p" size="body-l" tone="ink-2" measure>
            {dict.home.hero.mission}
          </Text>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={pathFor(locale, "projects")} variant="primary">
              {dict.home.hero.ctaProjects}
            </LinkButton>
            <LinkButton href={pathFor(locale, "about")} variant="glass">
              {dict.home.hero.ctaAbout}
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
