import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Text } from "@/components/ui/Text";
import { getExperts, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";

import { PersonDialog } from "./PersonDialog";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Ekspertlar kengashi: sarlavha tinch lojuvard lentada, portretlar 6/3/2 ustun (oltita aʼzo har
 * kenglikda toʻliq qatorlar beradi); faqat haqiqiy odamlar, ism kelmaguncha soha imzosi.
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
        lead={e.lead}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "experts"), label: dict.nav.experts, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          <ul className="people-grid" data-card-group="" aria-label={e.title}>
            {experts.map((person, index) => {
              const role = t(person.role, locale);
              const field = person.field ? t(person.field, locale) : null;
              const name = person.name ? t(person.name, locale) : null;
              return (
                <li key={person.id} className="people-card paper-look" data-card="">
                  <PortraitFrame
                    ratio="4:5"
                    className="people-portrait"
                    motion={{ mode: "smooth", index }}
                  />
                  <div className="people-card-text">
                    <p className="t-label" data-card-title="">
                      {name ?? field ?? role}
                    </p>
                    {name && field ? (
                      <p className="t-small text-ink-3">
                        {e.field}: {field}
                      </p>
                    ) : null}
                    {name ? (
                      <p className="t-small text-ink-2">
                        {e.role}: {role}
                      </p>
                    ) : null}
                  </div>
                  {name && person.bio ? (
                    <PersonDialog
                      name={name}
                      role={role}
                      field={field}
                      bio={t(person.bio, locale)}
                      openLabel={e.open}
                      closeLabel={dict.common.actions.close}
                      dialogLabel={fill(dict.people.dialogLabel, { name })}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
          <Text as="p" size="small" tone="ink-3" className="people-note">
            {e.pending}
          </Text>
        </Container>
      </Section>
    </>
  );
}
