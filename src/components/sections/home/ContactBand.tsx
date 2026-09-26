import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { getContacts, t } from "@/content";
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
    <Section labelledBy="home-contact" tone="light">
      <Container>
        <SectionHeader id="home-contact" title={h.heading} />
        <Reveal className="contact-band-card">
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
