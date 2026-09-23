import { getConfirmedPartners } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import { ContactBand } from "./ContactBand";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { NewsTeaser } from "./NewsTeaser";
import { PartnersField } from "./PartnersField";
import { PeopleTeaser } from "./PeopleTeaser";
import { PortalSection } from "./PortalSection";
import { ProjectsQuadrant } from "./ProjectsQuadrant";

interface HomePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Bosh sahifa: Darvoza → portal → chor-bogʻ → yangiliklar → galereya → odamlar → hamkorlar (≥6 boʻlsa) → aloqa. */
export function HomePage({ locale, dict }: HomePageProps) {
  const partners = getConfirmedPartners();
  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <PortalSection locale={locale} dict={dict} />
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
