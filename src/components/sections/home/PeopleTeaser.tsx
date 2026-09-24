import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { KundalPanel } from "@/components/ornament/KundalPanel";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
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
      <PortraitFrame ratio="3:4" role={role} className="people-portrait" />
      {/* Ism boʻlmasa ramka ichidagi lavozim yetarli: takrorlanmaydi. */}
      {person.name ? (
        <p className="t-label people-name" data-card-title="">
          {t(person.name, locale)}
        </p>
      ) : null}
      {field ? (
        <p className="t-small text-ink-3" data-card-title={person.name ? undefined : ""}>
          {field}
        </p>
      ) : null}
    </li>
  );
}

/** Rahbariyat va ekspertlar: kundal paneli ortidagi sarlavha, portret ramkalari; telefonda scroll-snap qator. */
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
            <Reveal
              as="ul"
              className="people-row"
              stagger
              attrs={{ "data-card-group": "" }}
              label={h.leadership}
              tabIndex={0}
            >
              {leaders.map((p) => (
                <PersonCard key={p.id} person={p} locale={locale} />
              ))}
            </Reveal>
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
            <Reveal
              as="ul"
              className="people-row"
              stagger
              attrs={{ "data-card-group": "" }}
              label={h.experts}
              tabIndex={0}
            >
              {experts.map((p) => (
                <PersonCard key={p.id} person={p} locale={locale} />
              ))}
            </Reveal>
          </div>
        </div>
        <p className="t-small text-ink-3 pt-6">{dict.people.experts.pending}</p>
      </Container>
    </Section>
  );
}
