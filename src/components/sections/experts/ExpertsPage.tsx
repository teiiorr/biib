import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { MonogramTile } from "@/components/ui/MonogramTile";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Text } from "@/components/ui/Text";
import { getExperts, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";

import { PersonDialogLeaf } from "../lazy-leaves";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Ekspertlar kengashi: sarlavha tinch lojuvard lentada. Tasdiqlangan kengash portretlar 6/3/2 ustunda
 * (oltita aʼzo har kenglikda toʻliq qatorlar); tasdiq kutilayotganda 3/2/1 ustunli ixcham qatorlar.
 */
export function ExpertsPage({ locale, dict }: PageProps) {
  const experts = getExperts();
  const e = dict.people.experts;
  /* Hamma aʼzo tasdiqlangan va surati bor boʻlsa portret kartalari, aks holda ixcham roʻyxat. */
  const portraits = experts.every((p) => p.status === "confirmed" && p.name && p.photo);
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
          {portraits ? (
            <ul className="people-grid" data-card-group="" aria-label={e.title}>
              {experts.map((person, index) => {
                const role = t(person.role, locale);
                const field = person.field ? t(person.field, locale) : null;
                const name = person.name ? t(person.name, locale) : role;
                return (
                  <li key={person.id} className="people-card" data-card="">
                    <PortraitFrame
                      ratio="4:5"
                      className="people-portrait"
                      motion={{ mode: "smooth", index }}
                    >
                      {person.photo ? (
                        <Picture
                          src={person.photo}
                          alt={name}
                          fill
                          sizes="(min-width: 1024px) 190px, (min-width: 600px) 30vw, 45vw"
                        />
                      ) : null}
                    </PortraitFrame>
                    <div className="people-card-text">
                      <p className="t-label" data-card-title="">
                        {name}
                      </p>
                      {field ? (
                        <p className="t-small text-ink-3">
                          {e.field}: {field}
                        </p>
                      ) : null}
                      <p className="t-small text-ink-2">
                        {e.role}: {role}
                      </p>
                    </div>
                    {person.bio ? (
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
                  </li>
                );
              })}
            </ul>
          ) : (
            /* Ism va surat kelguncha: 64 px belgi va soha, yonida halol holat; boʻsh portret ramkasi yoʻq. */
            <ul className="person-rows" aria-label={e.title}>
              {experts.map((person) => {
                const role = t(person.role, locale);
                const field = person.field ? t(person.field, locale) : null;
                return (
                  <li key={person.id} className="person-row">
                    <MonogramTile />
                    <div className="person-row-text">
                      <p className="t-label text-ink">{field ?? role}</p>
                      <p className="t-small text-ink-3">{dict.common.status.awaiting}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {portraits ? null : (
            <Text as="p" size="small" tone="ink-3" className="people-note">
              {e.pending}
            </Text>
          )}
        </Container>
      </Section>
    </>
  );
}
