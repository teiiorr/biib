import { getConfirmedPartners } from "@/content";
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
import { ProjectsQuadrant } from "./ProjectsQuadrant";

interface HomePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Bosh sahifa: Darvoza (video sahnasi) → missiya → UPOP TREND → yangiliklar → galereya → odamlar → hamkorlar (≥6 boʻlsa) → aloqa. */
export function HomePage({ locale, dict }: HomePageProps) {
  const partners = getConfirmedPartners();
  return (
    <>
      <HeroScene>
        <HeroSection locale={locale} dict={dict} />
      </HeroScene>
      <MissionSection
        copy={{
          label: dict.home.portal.label,
          statement: dict.home.portal.statement,
          note: dict.birlashma.note.mission,
        }}
      />
      <ProjectsQuadrant locale={locale} dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      <GallerySection locale={locale} dict={dict} />
      <PeopleTeaser locale={locale} dict={dict} />
      {partners.length >= 6 ? (
        <PartnersField locale={locale} dict={dict} partners={partners} />
      ) : null}
      <ContactBand locale={locale} dict={dict} />
    </>
  );
}
