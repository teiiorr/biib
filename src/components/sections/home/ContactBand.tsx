import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { getContacts, t } from "@/content";
import { FILLER } from "@/content/placeholder";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface ContactBandProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Aloqa: markazdagi sarlavha, ostida bitta sokin karta — manzil va telefon ikki teng ustunda
 * (bir xil uslub, bir tepa chiziq), oʻng chetda ikki harakat (kompyuterda shu qatorda).
 */
export function ContactBand({ locale, dict }: ContactBandProps) {
  const c = getContacts();
  const h = dict.home.contact;
  return (
    <Section labelledBy="home-contact">
      <Container>
        <SectionHeader id="home-contact" title={h.heading} />
        <Reveal className="contact-band-card">
          <dl className="contact-band-list">
            <div className="feature contact-band-item">
              <FeatureIcon name="map-pin" />
              <dt className="sr-only">{dict.contacts.details.address}</dt>
              <dd className="t-body">
                {c.address.value ? t(c.address.value, locale) : FILLER.line}
              </dd>
            </div>
            <div className="feature contact-band-item">
              <FeatureIcon name="phone" />
              <dt className="sr-only">{dict.contacts.details.phone}</dt>
              <dd className="t-body tnum contact-band-phones">
                {c.phones.value?.length
                  ? c.phones.value.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                        {phone}
                      </a>
                    ))
                  : FILLER.word}
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
