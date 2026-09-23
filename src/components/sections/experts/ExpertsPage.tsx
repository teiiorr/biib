import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { KundalPanel } from "@/components/ornament/KundalPanel";
import { RavoqFrame } from "@/components/ornament/RavoqFrame";
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

/** Ekspertlar kengashi: kundal paneli ortida sarlavha, ravoq portretlar 4/3/2 ustun; faqat haqiqiy odamlar. */
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
        tone="dark"
        art={
          <div className="official-kundal birlashma:hidden" aria-hidden="true">
            <KundalPanel seed="ekspertlar" light>
              <span />
            </KundalPanel>
          </div>
        }
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "experts"), label: dict.nav.experts, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          <ul className="people-grid" data-card-group="" aria-label={e.title}>
            {experts.map((person) => {
              const role = t(person.role, locale);
              const field = person.field ? t(person.field, locale) : null;
              const name = person.name ? t(person.name, locale) : null;
              return (
                <li key={person.id} className="people-card paper-look" data-card="">
                  <RavoqFrame ratio="3:4" role={field ?? role} className="people-portrait" />
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
          <Text as="p" size="small" tone="ink-3" className="pt-8">
            {e.pending}
          </Text>
          <DesignArt slot="people-heading" locale={locale} className="hidden" />
        </Container>
      </Section>
    </>
  );
}
