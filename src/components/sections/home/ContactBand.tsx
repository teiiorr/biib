import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Palak } from "@/components/ornament/Palak";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getContacts, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface ContactBandProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Aloqa: Atlasda bitta sokin karta — sarlavha yonida kichik palak (ataylab qoldirilgan boʻshligʻi
 * bilan, 11.5), oʻngda manzil va telefon, pastda ikki harakat. Birlashmada otkritka.
 */
export function ContactBand({ locale, dict }: ContactBandProps) {
  const c = getContacts();
  const h = dict.home.contact;
  return (
    <Section labelledBy="home-contact" tone="light" className="contact-band">
      <Container className="contact-band-grid paper-look">
        <DesignArt
          slot="contacts-band"
          locale={locale}
          className="contact-band-art"
          copy={{ postcardLabel: dict.contacts.form.postcardLabel }}
        />
        <Reveal className="contact-band-text">
          <div className="contact-band-head">
            <div className="contact-band-palak birlashma:hidden">
              <Palak
                size={80}
                seed="aloqa"
                bloom
                gapLabel={dict.ornament.palakGapLabel}
                gapText={dict.ornament.palakGap}
              />
            </div>
            <div className="contact-band-title">
              <Heading level={2} size="h2" id="home-contact">
                {h.heading}
              </Heading>
              <Text as="p" size="body-l" tone="ink-2" measure>
                {h.lead}
              </Text>
            </div>
          </div>
          <dl className="contact-band-list">
            <div>
              <dt className="t-micro text-ink-3">{dict.contacts.details.address}</dt>
              <dd className="t-body">
                {c.address.value ? t(c.address.value, locale) : dict.contacts.details.pending}
              </dd>
            </div>
            <div>
              <dt className="t-micro text-ink-3">{dict.contacts.details.phone}</dt>
              <dd className="t-body tnum">
                {c.phones.value?.[0] ?? dict.contacts.details.pending}
              </dd>
            </div>
          </dl>
          <div className="contact-band-actions">
            {c.telegram.value ? (
              <LinkButton
                href={c.telegram.value}
                variant="primary"
                size="48"
                icon="telegram"
                external
                externalHint={dict.common.hints.external}
              >
                {h.telegram}
              </LinkButton>
            ) : null}
            <LinkButton href={pathFor(locale, "contacts")} variant="glass" size="48">
              {h.open}
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
