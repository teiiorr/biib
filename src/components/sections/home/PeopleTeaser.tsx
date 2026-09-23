import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { KundalPanel } from "@/components/ornament/KundalPanel";
import { RavoqFrame } from "@/components/ornament/RavoqFrame";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getExperts, getLeadership, t } from "@/content";
import type { Person } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PeopleTeaserProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

function PersonCard({ person, locale }: { person: Person; locale: Locale }) {
  const role = t(person.role, locale);
  const field = person.field ? t(person.field, locale) : null;
  return (
    <li className="people-card paper-look" data-card="">
      <RavoqFrame ratio="3:4" role={field ?? role} className="people-portrait" />
      <p className="t-label people-name" data-card-title="">
        {person.name ? t(person.name, locale) : role}
      </p>
      {field ? <p className="t-small text-ink-3">{field}</p> : null}
    </li>
  );
}

/** Rahbariyat va ekspertlar: kundal paneli ortidagi sarlavha, ravoq portretlar; telefonda scroll-snap qator. */
export function PeopleTeaser({ locale, dict }: PeopleTeaserProps) {
  const leaders = getLeadership().slice(0, 2);
  const experts = getExperts().slice(0, 4);
  const h = dict.home.people;
  return (
    <Section labelledBy="home-people" tone="dark" className="people-section">
      <Container>
        <div className="people-head">
          <div className="people-kundal birlashma:hidden" aria-hidden="true">
            <KundalPanel seed="odamlar" light>
              <span />
            </KundalPanel>
          </div>
          <div className="people-head-text">
            <Heading level={2} size="h2" id="home-people">
              {h.heading}
            </Heading>
            <Text as="p" size="body-l" className="people-lead" measure>
              {h.lead}
            </Text>
          </div>
        </div>
        <div className="people-groups">
          <div>
            <div className="section-head-row">
              <Heading level={3} size="h4">
                {h.leadership}
              </Heading>
              <LinkButton
                href={pathFor(locale, "leadership")}
                variant="ghost"
                size="40"
                icon="arrow-right"
                iconPosition="end"
              >
                {dict.common.actions.viewAll}
              </LinkButton>
            </div>
            <ul className="people-row" data-card-group="" aria-label={h.leadership}>
              {leaders.map((p) => (
                <PersonCard key={p.id} person={p} locale={locale} />
              ))}
            </ul>
          </div>
          <div>
            <div className="section-head-row">
              <Heading level={3} size="h4">
                {h.experts}
              </Heading>
              <LinkButton
                href={pathFor(locale, "experts")}
                variant="ghost"
                size="40"
                icon="arrow-right"
                iconPosition="end"
              >
                {dict.common.actions.viewAll}
              </LinkButton>
            </div>
            <ul className="people-row" data-card-group="" aria-label={h.experts}>
              {experts.map((p) => (
                <PersonCard key={p.id} person={p} locale={locale} />
              ))}
            </ul>
          </div>
        </div>
        <p className="t-small text-ink-3 pt-6">{dict.people.experts.pending}</p>
      </Container>
    </Section>
  );
}
