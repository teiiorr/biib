import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { getExperts, t } from "@/content";
import { fillerName } from "@/content/placeholder";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";

import { PersonDialogLeaf } from "../lazy-leaves";
import { PersonCard } from "../people/PersonCard";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Ekspertlar kengashi: markazdagi sarlavha, ostida katta portretli teng kartalar (2 / 3 / 3 ustun):
 * oltita aʼzo har kenglikda toʻliq qatorlar beradi. Tarjimai hol faqat tasdiqlangan aʼzoda, oynada.
 */
export function ExpertsPage({ locale, dict }: PageProps) {
  const experts = getExperts();
  const e = dict.people.experts;
  const jsonld = experts
    .map((p) => personJsonLd({ person: p, locale, dict }))
    .filter((x): x is Record<string, unknown> => Boolean(x));
  return (
    <>
      <JsonLd data={jsonld.length ? jsonld : null} />
      <PageHero
        title={e.title}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "experts"), label: dict.nav.experts, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          <ul className="person-tiles" data-columns="3" data-card-group="" aria-label={e.title}>
            {experts.map((person, index) => {
              const role = t(person.role, locale);
              const field = person.field ? t(person.field, locale) : null;
              const name = person.name ? t(person.name, locale) : fillerName(index + 3);
              const confirmed = person.status === "confirmed";
              return (
                <PersonCard
                  key={person.id}
                  id={person.id}
                  name={name}
                  role={field ? `${field} · ${role}` : role}
                  photo={confirmed ? person.photo : null}
                  email={confirmed ? person.email : null}
                  index={index}
                  sizes="(min-width: 1440px) 416px, (min-width: 600px) 30vw, 45vw"
                >
                  {confirmed && person.bio ? (
                    <PersonDialogLeaf
                      name={name}
                      role={role}
                      field={field}
                      bio={t(person.bio, locale)}
                      openLabel={e.open}
                      closeLabel={dict.common.actions.close}
                      dialogLabel={fill(dict.people.dialogLabel, { name })}
                    />
                  ) : null}
                </PersonCard>
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
