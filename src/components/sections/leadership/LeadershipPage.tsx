import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { PersonPlaceholder } from "@/components/ui/PersonPlaceholder";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { Table } from "@/components/ui/Table";
import { getLeadership, t } from "@/content";
import { FILLER, fillerName } from "@/content/placeholder";
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
 * Rahbariyat: eng qatʼiy sahifa. Teng kartalar 2 / 1 ustunda; har kartada bosh qism (portret yoki belgi
 * plitkasi, lavozim, ism) va bir xil tartibdagi faktlar: qabul jadvali va rasmiy pochta. Kartalar
 * qatorlari subgrid: qoʻshni kartalarda faktlar bir chiziqdan boshlanadi.
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
          <div className="leaders" data-card-group="">
            {leaders.map((person, index) => {
              const role = t(person.role, locale);
              const name = person.name ? t(person.name, locale) : fillerName(index);
              const photo = person.status === "confirmed" && person.photo ? person.photo : null;
              return (
                <article
                  key={person.id}
                  className="leader"
                  data-card=""
                  aria-labelledby={`${person.id}-name`}
                >
                  <div className="leader-head" data-photo={photo ? "" : undefined}>
                    {photo ? (
                      <PortraitFrame
                        ratio="4:5"
                        className="leader-portrait"
                        motion={{ mode: "smooth", index }}
                      >
                        <Picture src={photo} alt={name} fill sizes="120px" />
                      </PortraitFrame>
                    ) : (
                      <PersonPlaceholder />
                    )}
                    <div className="leader-name">
                      <Heading level={2} size="h3" align="start" id={`${person.id}-name`}>
                        {name}
                      </Heading>
                      <p className="t-small text-ink-3">{role}</p>
                      {person.bio ? (
                        <p className="t-small text-ink-2">{t(person.bio, locale)}</p>
                      ) : null}
                    </div>
                  </div>
                  <dl className="leader-facts">
                    <div className="leader-fact">
                      <dt className="t-small text-ink-2">{l.reception}</dt>
                      <dd>
                        {person.reception && person.reception.length ? (
                          <Table
                            caption={l.reception}
                            captionHidden
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
                          <span className="t-small text-ink-3">{FILLER.word}</span>
                        )}
                      </dd>
                    </div>
                    <div className="leader-fact">
                      <dt className="t-small text-ink-2">{l.email}</dt>
                      <dd>
                        {person.email ? (
                          <a
                            href={`mailto:${person.email}`}
                            className="leader-email t-small text-tint"
                          >
                            {person.email}
                          </a>
                        ) : (
                          <span className="t-small text-ink-3">{FILLER.word}</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
