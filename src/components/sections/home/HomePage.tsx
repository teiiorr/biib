import { getArtworks, getConfirmedPartners } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import { ContactBand } from "./ContactBand";
import { GallerySection } from "./GallerySection";
import { HeroScene } from "./HeroScene";
import { HeroSection } from "./HeroSection";
import { MissionSection } from "./MissionSection";
import { NewsTeaser } from "./NewsTeaser";
import { PartnersField } from "./PartnersField";
import { PeopleTeaser } from "./PeopleTeaser";
import { UpopFeature } from "./UpopFeature";

interface HomePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Bosh sahifa: Darvoza (video sahnasi) → missiya → UPOP TREND → yangiliklar → galereya (rozilik bilan
 * ishlar boʻlsa) → odamlar → hamkorlar (≥ 6 boʻlsa) → aloqa. Boʻsh boʻlim chizilmaydi.
 */
export function HomePage({ locale, dict }: HomePageProps) {
  const partners = getConfirmedPartners();
  const hasArtworks = getArtworks().length > 0;
  return (
    <>
      {/* Missiya sahnaning ikkinchi yarmi: yopishqoq kadr ustidan koʻtariladi, boʻsh xira ekran qolmaydi. */}
      <HeroScene>
        <HeroSection locale={locale} dict={dict} />
        {/* Video skroll qismi: qahramon yopishgan holda shu masofada kadrma-kadr suriladi. */}
        <div className="home-hero-scrub" aria-hidden="true" />
        <MissionSection
          copy={{
            label: dict.home.portal.label,
            statement: dict.home.portal.statement,
          }}
        />
      </HeroScene>
      <UpopFeature locale={locale} dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      {hasArtworks ? <GallerySection locale={locale} dict={dict} /> : null}
      <PeopleTeaser locale={locale} dict={dict} />
      {partners.length >= 6 ? (
        <PartnersField locale={locale} dict={dict} partners={partners} />
      ) : null}
      <ContactBand locale={locale} dict={dict} />
    </>
  );
}
