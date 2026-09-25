import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Table } from "@/components/ui/Table";
import { Text } from "@/components/ui/Text";
import { getLeadership, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Rahbariyat: eng qatʼiy sahifa. Kompyuterda ikki rahbar yonma-yon (har biri 6 ustun: portret 2,
 * matn 4), planshetda bittadan, telefonda kichik portret matn yonida; qabul jadvali, rasmiy pochta.
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
        lead={l.lead}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "leadership"), label: dict.nav.leadership, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container grid className="leaders">
          {leaders.map((person, index) => {
            const role = t(person.role, locale);
            const name = person.name ? t(person.name, locale) : null;
            return (
              <article
                key={person.id}
                className="leader paper-look"
                data-card=""
                aria-labelledby={`${person.id}-name`}
              >
                <PortraitFrame
                  ratio="4:5"
                  className="leader-portrait"
                  motion={{ mode: "smooth", index }}
                />
                <div className="leader-text">
                  <Heading level={2} size="h3" id={`${person.id}-name`} data-card-title="">
                    {name ?? role}
                  </Heading>
                  {name ? (
                    <Text as="p" tone="ink-2">
                      {role}
                    </Text>
                  ) : null}
                  {person.bio ? <Text as="p">{t(person.bio, locale)}</Text> : null}
                  {/* Yorliq qiymatiga yaqin (4 px), bloklar orasi 16 px: yaqinlik qonuni. */}
                  <div className="leader-facts">
                    <div className="leader-fact">
                      <h3 className="t-label text-ink-2">{l.reception}</h3>
                      {person.reception && person.reception.length ? (
                        <Table
                          caption={l.reception}
                          columns={[
                            { key: "day", label: l.day },
                            { key: "hours", label: l.hours, numeric: true },
                          ]}
                          rows={person.reception.map((slot, i) => ({
                            key: `${person.id}-${i}`,
                            cells: { day: t(slot.day, locale), hours: slot.hours },
                          }))}
                        />
                      ) : (
                        <Text as="p" size="small" tone="ink-3">
                          {l.receptionPending}
                        </Text>
                      )}
                    </div>
                    <div className="leader-fact">
                      <h3 className="t-label text-ink-2">{l.email}</h3>
                      {person.email ? (
                        <a href={`mailto:${person.email}`} className="t-body text-tint">
                          {person.email}
                        </a>
                      ) : (
                        <Text as="p" size="small" tone="ink-3">
                          {l.emailPending}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          <Text as="p" size="small" tone="ink-3" className="leaders-note">
            {l.pending}
          </Text>
        </Container>
      </Section>
    </>
  );
}
