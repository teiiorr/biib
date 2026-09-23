import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { Section } from "@/components/layout/Section";
import { GanchLayers } from "@/components/ornament/GanchLayers";
import { GirihLattice } from "@/components/ornament/GirihLattice";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface HeroSectionProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Darvoza: 100svh, abr ipak fon (Atlas) yoki ustaxona stoli (Birlashma), matn birinchi kadrda (LCP).
 * Nom pastki uchdan birida, chapda toʻrda; bitta jumla va ikkita harakat.
 */
export function HeroSection({ locale, dict }: HeroSectionProps) {
  return (
    <Section padded={false} labelledBy="hero-title" className="home-hero" as="section">
      <div className="home-hero-art">
        <DesignArt slot="home-hero" locale={locale} className="home-hero-slot" />
      </div>
      <div className="home-hero-ganch birlashma:hidden" aria-hidden="true">
        <GanchLayers seed="darvoza" parallax />
      </div>
      <div className="home-hero-lattice birlashma:hidden" aria-hidden="true">
        <GirihLattice symmetry={10} cell={112} />
      </div>
      <Container className="home-hero-content">
        <Heading level={1} size="display-xl" id="hero-title" className="home-hero-title">
          {dict.common.brand.name}
        </Heading>
        <Text as="p" size="body-l" tone="ink-2" measure className="home-hero-mission">
          {dict.home.hero.mission}
        </Text>
        <div className="home-hero-actions">
          <LinkButton href={pathFor(locale, "projects")} variant="primary" size="56">
            {dict.home.hero.ctaProjects}
          </LinkButton>
          <LinkButton href={pathFor(locale, "about")} variant="glass" size="56">
            {dict.home.hero.ctaAbout}
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
