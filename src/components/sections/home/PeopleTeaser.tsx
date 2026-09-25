import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitLines } from "@/components/motion/SplitLines";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Heading } from "@/components/ui/Heading";
import { Picture } from "@/components/ui/Picture";
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

/** Portret faqat tasdiqlangan va surati bor odamda: boʻsh ramkalar qatori chizilmaydi. */
function hasPortrait(person: Person): person is Person & { photo: string } {
  return person.status === "confirmed" && person.photo !== null && person.name !== null;
}

function PersonCard({ person, locale, index }: { person: Person; locale: Locale; index: number }) {
  const role = t(person.role, locale);
  const field = person.field ? t(person.field, locale) : null;
  const name = person.name ? t(person.name, locale) : null;
  return (
    <li className="people-card paper-look" data-card="">
      <PortraitFrame ratio="4:5" className="people-portrait" motion={{ mode: "smooth", index }}>
        {person.photo ? (
          <Picture
            src={person.photo}
            alt={name ?? role}
            fill
            sizes="(min-width: 1024px) 200px, 45vw"
          />
        ) : null}
      </PortraitFrame>
      <div className="people-card-text">
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
  readonly awaiting: string;
  readonly className: string;
}

/* Guruh sarlavhasining oʻzi sahifaga havola: ikki guruh yonma-yon turganda «hammasini koʻrish»
   strelkasi qoʻshni guruh sarlavhasiga qarab qolmaydi. */
function PeopleGroup({ heading, href, people, locale, awaiting, className }: PeopleGroupProps) {
  const portraits = people.length > 0 && people.every(hasPortrait);
  return (
    <div className={`people-group ${className}`}>
      <Heading level={3} size="h4" className="people-group-head">
        <TransitionLink href={href} className="people-group-link">
          {heading}
          <Icon name="arrow-right" size={20} className="people-group-arrow" />
        </TransitionLink>
      </Heading>
      {portraits ? (
        <ul className="people-row" data-card-group="" aria-label={heading}>
          {people.map((p, index) => (
            <PersonCard key={p.id} person={p} locale={locale} index={index} />
          ))}
        </ul>
      ) : (
        /* Ism va surat kelguncha: lavozim roʻyxati, yonida halol holat. Boʻsh portret ramkasi yoʻq. */
        <ul className="people-roles" aria-label={heading}>
          {people.map((p) => {
            const name = p.name ? t(p.name, locale) : null;
            const role = p.field ? t(p.field, locale) : t(p.role, locale);
            return (
              <li key={p.id} className="people-role">
                <span className="t-body text-ink">{name ?? role}</span>
                <span className="t-small text-ink-3">{name ? role : awaiting}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Rahbariyat va ekspertlar: sarlavha va mazmun bitta sirtda. Tasdiqlanmagan odamlar lavozim
 * roʻyxati boʻlib chiqadi (kompyuterda ikki ustun, 3 + 3 qator); hammasi tasdiqlangan guruh
 * avtomatik portret kartalariga oʻtadi.
 */
export function PeopleTeaser({ locale, dict }: PeopleTeaserProps) {
  const leaders = getLeadership().slice(0, 3);
  const experts = getExperts().slice(0, 3);
  const h = dict.home.people;
  const awaiting = dict.common.status.awaiting;
  return (
    <Section labelledBy="home-people" rhythm="band" className="people-section">
      <Container grid className="people-groups">
        <div className="people-head section-head">
          <SplitLines as="h2" className="t-h2 text-balance text-ink" id="home-people">
            {h.heading}
          </SplitLines>
          <Text as="p" size="body-l" tone="ink-2" measure>
            {h.lead}
          </Text>
        </div>
        <PeopleGroup
          heading={h.leadership}
          href={pathFor(locale, "leadership")}
          people={leaders}
          locale={locale}
          awaiting={awaiting}
          className="people-group-leaders"
        />
        <PeopleGroup
          heading={h.experts}
          href={pathFor(locale, "experts")}
          people={experts}
          locale={locale}
          awaiting={awaiting}
          className="people-group-experts"
        />
      </Container>
    </Section>
  );
}
