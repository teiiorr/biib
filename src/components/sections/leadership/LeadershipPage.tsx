import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { getLeadership, t } from "@/content";
import { fillerName } from "@/content/placeholder";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";

import { PersonCard } from "../people/PersonCard";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Rahbariyat: eng qatʼiy sahifa. Toʻrtta teng karta (2 / 2 / 4 ustun): katta portret, ostida lavozim,
 * ism-familiya va rasmiy pochta (egasining talabi: kartada faqat shular).
 */
export function LeadershipPage({ locale, dict }: PageProps) {
  const leaders = getLeadership();
  const l = dict.people.leadership;
  const jsonld = leaders
    .map((p) => personJsonLd({ person: p, locale, dict }))
    .filter((x): x is Record<string, unknown> => Boolean(x));
  return (
    <>
      <JsonLd data={jsonld.length ? jsonld : null} />
      <PageHero
        title={l.title}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "leadership"), label: dict.nav.leadership, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          <ul className="person-tiles" data-columns="4" data-card-group="" aria-label={l.title}>
            {leaders.map((person, index) => {
              const confirmed = person.status === "confirmed";
              return (
                <PersonCard
                  key={person.id}
                  id={person.id}
                  name={person.name ? t(person.name, locale) : fillerName(index)}
                  role={t(person.role, locale)}
                  photo={confirmed ? person.photo : null}
                  email={confirmed ? person.email : null}
                  index={index}
                  sizes="(min-width: 1440px) 304px, (min-width: 1024px) 22vw, 45vw"
                />
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
