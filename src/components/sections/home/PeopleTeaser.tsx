import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitLines } from "@/components/motion/SplitLines";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Heading } from "@/components/ui/Heading";
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

function PersonCard({ person, locale, index }: { person: Person; locale: Locale; index: number }) {
  const role = t(person.role, locale);
  const field = person.field ? t(person.field, locale) : null;
  const name = person.name ? t(person.name, locale) : null;
  return (
    <li className="people-card paper-look" data-card="">
      <PortraitFrame ratio="4:5" className="people-portrait" motion={{ mode: "smooth", index }} />
      <div className="people-card-text">
        {/* Ism kelmaguncha imzo: rahbarda lavozim, ekspertda soha — bir marta, ramka ichida emas. */}
        <p className="t-label people-name" data-card-title="">
          {name ?? field ?? role}
        </p>
        {name ? <p className="t-small text-ink-3">{field ?? role}</p> : null}
      </div>
    </li>
  );
}

interface PeopleGroupProps {
  readonly heading: string;
  readonly href: string;
  readonly people: readonly Person[];
  readonly locale: Locale;
  readonly className: string;
}

/* Guruh sarlavhasining oʻzi sahifaga havola: ikki guruh yonma-yon turganda «hammasini koʻrish»
   strelkasi qoʻshni guruh sarlavhasiga qarab qolmaydi. */
function PeopleGroup({ heading, href, people, locale, className }: PeopleGroupProps) {
  return (
    <div className={`people-group ${className}`}>
      <Heading level={3} size="h4" className="people-group-head">
        <TransitionLink href={href} className="people-group-link">
          {heading}
          <Icon name="arrow-right" size={20} className="people-group-arrow" />
        </TransitionLink>
      </Heading>
      <ul className="people-row" data-card-group="" aria-label={heading}>
        {people.map((p, index) => (
          <PersonCard key={p.id} person={p} locale={locale} index={index} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Rahbariyat va ekspertlar: sarlavha tinch lojuvard lentada (bezaksiz, bitta oltin chiziq), ostida
 * ikki guruh; portretlar doira ritmida yumshoq ochiladi. Kompyuterda 2 + 4 portret 12 ustunni, planshetda 2 + 2 sakkiz ustunni toʻliq egallaydi;
 * telefonda har guruh bitta toʻla qator (2 + 2), qolganlari sahifada.
 */
export function PeopleTeaser({ locale, dict }: PeopleTeaserProps) {
  const leaders = getLeadership().slice(0, 2);
  const experts = getExperts().slice(0, 4);
  const h = dict.home.people;
  return (
    <Section labelledBy="home-people" rhythm="none" className="people-section">
      <div className="navy-band people-band section-band" data-tone="dark">
        <Container className="people-head">
          <SplitLines as="h2" className="t-h2 text-balance text-ink" id="home-people">
            {h.heading}
          </SplitLines>
          <Text as="p" size="body-l" tone="ink-2" measure>
            {h.lead}
          </Text>
        </Container>
      </div>
      <div className="people-body" data-tone="light">
        <Container grid className="people-groups">
          <PeopleGroup
            heading={h.leadership}
            href={pathFor(locale, "leadership")}
            people={leaders}
            locale={locale}
            className="people-group-leaders"
          />
          <PeopleGroup
            heading={h.experts}
            href={pathFor(locale, "experts")}
            people={experts}
            locale={locale}
            className="people-group-experts"
          />
          <p className="t-small text-ink-3 people-groups-note">{dict.people.experts.pending}</p>
        </Container>
      </div>
    </Section>
  );
}
