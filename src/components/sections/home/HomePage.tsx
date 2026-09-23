import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import { ContactBand } from "./ContactBand";
import { HeroSection } from "./HeroSection";
import { NewsTeaser } from "./NewsTeaser";
import { PeopleTeaser } from "./PeopleTeaser";
import { PortalSection } from "./PortalSection";
import { ProjectsQuadrant } from "./ProjectsQuadrant";

interface HomePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Bosh sahifa: Darvoza → portal → chor-bogʻ → yangiliklar → odamlar → aloqa (hamkorlar <6, chiqmaydi). */
export function HomePage({ locale, dict }: HomePageProps) {
  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <PortalSection locale={locale} dict={dict} />
      <ProjectsQuadrant locale={locale} dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      <PeopleTeaser locale={locale} dict={dict} />
      <ContactBand locale={locale} dict={dict} />
    </>
  );
}
