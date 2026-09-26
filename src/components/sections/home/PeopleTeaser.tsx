import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Heading } from "@/components/ui/Heading";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { getExperts, getLeadership, t } from "@/content";
import { fillerName } from "@/content/placeholder";
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
    <li className="people-card" data-card="">
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
  /** Oʻrinbosar nomlar guruhlar orasida takrorlanmasin. */
  readonly offset: number;
  readonly className: string;
}

/* Guruh sarlavhasining oʻzi sahifaga havola: ikki guruh yonma-yon turganda «hammasini koʻrish»
   strelkasi qoʻshni guruh sarlavhasiga qarab qolmaydi. */
function PeopleGroup({ heading, href, people, locale, offset, className }: PeopleGroupProps) {
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
        /* Surat kelguncha: belgi, ism (tasdiqlanmagan boʻlsa oʻrinbosar) va lavozim bir qatorda. */
        <ul className="people-roles" aria-label={heading}>
          {people.map((p, index) => {
            const name = p.name ? t(p.name, locale) : fillerName(offset + index);
            const role = p.field ? t(p.field, locale) : t(p.role, locale);
            return (
              <li key={p.id} className="people-role feature">
                <FeatureIcon name="user" />
                <span className="t-body text-ink">{name}</span>
                <span className="t-small text-ink-3">{role}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Rahbariyat va ekspertlar: markazdagi sarlavha, ostida ikki teng guruh yonma-yon. Tasdiqlanmagan
 * odamlar lavozim roʻyxati boʻlib chiqadi (kompyuterda ikki ustun, 3 + 3 qator); hammasi tasdiqlangan
 * guruh avtomatik portret kartalariga oʻtadi.
 */
export function PeopleTeaser({ locale, dict }: PeopleTeaserProps) {
  const leaders = getLeadership().slice(0, 3);
  const experts = getExperts().slice(0, 3);
  const h = dict.home.people;
  return (
    <Section labelledBy="home-people" rhythm="band" className="people-section">
      <Container>
        <SectionHeader id="home-people" title={h.heading} split />
      </Container>
      <Container grid className="people-groups">
        <PeopleGroup
          heading={h.leadership}
          href={pathFor(locale, "leadership")}
          people={leaders}
          locale={locale}
          offset={0}
          className="people-group-leaders"
        />
        <PeopleGroup
          heading={h.experts}
          href={pathFor(locale, "experts")}
          people={experts}
          locale={locale}
          offset={3}
          className="people-group-experts"
        />
      </Container>
    </Section>
  );
}
