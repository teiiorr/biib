import { Fragment, type ReactNode } from "react";

import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { getContacts, t } from "@/content";
import { FILLER } from "@/content/placeholder";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { contactFormEnabled } from "@/lib/contact/config";

import { ContactFormLeaf, CopyButtonLeaf } from "../lazy-leaves";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

interface Fact {
  readonly key: string;
  readonly icon: IconName;
  readonly label: string;
  readonly value: string | null;
  readonly href?: string;
  /** Bir nechta qiymat (telefonlar): har biri oʻz havolasi, alohida qatorda. */
  readonly links?: ReadonlyArray<{ readonly text: string; readonly href: string }>;
}

/* Uzun manzil (pochta, havola) tor ekranda soʻz oʻrtasidan emas, «@» va «/» dan keyin boʻlinadi. */
function breakable(text: string): ReactNode {
  return text.split(/(?<=[@/])/).map((part, index) => (
    <Fragment key={index}>
      {index > 0 ? <wbr /> : null}
      {part}
    </Fragment>
  ));
}

const telHref = (phone: string): string => `tel:${phone.replace(/\s/g, "")}`;

/**
 * Aloqa: markazdagi sarlavha ostida oltita teng rekvizit kartasi (3 / 2 / 1 ustun). Har kartada bir xil
 * uch qator: yorliq, qiymat, oʻngda harakat; qatorlar subgrid, qoʻshni kartalarda bir chiziqda turadi.
 * Keyin yozish boʻlimi: shakl (tugma oʻngda) yoki Telegram havolasi.
 */
export function ContactsPage({ locale, dict }: PageProps) {
  const c = getContacts();
  const d = dict.contacts;
  const formEnabled = contactFormEnabled();
  const phones = c.phones.value ?? [];
  const addressUz = c.address.value?.uz ?? null;
  const facts: Fact[] = [
    {
      key: "address",
      icon: "map-pin",
      label: d.details.address,
      value: c.address.value ? t(c.address.value, locale) : null,
    },
    {
      key: "phone",
      icon: "phone",
      label: d.details.phone,
      value: phones[0] ?? null,
      ...(phones.length ? { links: phones.map((p) => ({ text: p, href: telHref(p) })) } : {}),
    },
    {
      key: "email",
      icon: "mail",
      label: d.details.email,
      value: c.email.value,
      ...(c.email.value ? { href: `mailto:${c.email.value}` } : {}),
    },
    {
      key: "telegram",
      icon: "telegram",
      label: d.details.telegram,
      value: c.telegram.value,
      ...(c.telegram.value ? { href: c.telegram.value } : {}),
    },
    {
      key: "hours",
      icon: "clock",
      label: d.details.hours,
      value: c.hours.value ? t(c.hours.value, locale) : null,
    },
  ];
  const map = c.map.value;
  /* Telegram oʻz kartasida turibdi: tarmoqlar kartasida takrorlanmaydi (bitta maqsadga bitta havola). */
  const socials = c.socials.filter((s) => s.status === "confirmed" && s.id !== "telegram");
  const external = dict.common.hints.external;

  return (
    <>
      <PageHero
        title={d.title}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "contacts"), label: dict.nav.contacts, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section labelledBy="contacts-details">
        <Container>
          {/* Sahifa sarlavhasi darhol kartalar ustida: koʻrinadigan ikkinchi sarlavha ortiqcha,
              ekran oʻquvchisi uchun boʻlim nomi saqlanadi. */}
          <h2 id="contacts-details" className="sr-only">
            {d.details.heading}
          </h2>
          {/* Egasining talabi: boʻshliqsiz, tekis. Bitta guruhlangan roʻyxat (iOS sozlamalari kabi): har
              rekvizit bir qator — belgi, qiymat, oʻngda harakatlar; qatorlar orasida ingichka chiziq. */}
          <div className="grid-site">
            <Reveal
              as="dl"
              className="contact-list col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3"
              stagger
              distance={16}
              attrs={{ "data-audit": "gap", "data-grid-item": "" }}
            >
              {facts.map((fact) => (
                <div key={fact.key} className="contact-row feature">
                  <FeatureIcon name={fact.icon} />
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="contact-row-value">
                    {fact.links ? (
                      <ul className="contact-row-links">
                        {fact.links.map((link) => (
                          <li key={link.href}>
                            <a href={link.href} className="t-body tnum text-ink">
                              {link.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : fact.value && fact.href ? (
                      <a
                        href={fact.href}
                        className="t-body tnum text-ink"
                        {...(fact.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {/* Havola manzili qisqa koʻrsatiladi (t.me/…), nusxaga toʻliq manzil olinadi. */}
                        {breakable(fact.value.replace(/^https?:\/\//, ""))}
                      </a>
                    ) : (
                      <span className={fact.value ? "t-body tnum" : "t-body text-ink-3"}>
                        {fact.value ?? FILLER.line}
                      </span>
                    )}
                  </dd>
                  {fact.key === "address" && fact.value && (map || addressUz) ? (
                    /* Xarita tugmalari alohida: telefonda manzil ostida, kengroq ekranda nusxa yonida. */
                    <dd className="contact-row-maps">
                      <LinkButton
                        href={
                          map
                            ? `https://yandex.uz/maps/?pt=${map.lng},${map.lat}&z=16`
                            : `https://yandex.uz/maps/?text=${encodeURIComponent(addressUz ?? "")}`
                        }
                        variant="glass"
                        size="40"
                        external
                        externalHint={external}
                      >
                        {d.map.yandex}
                        <VisuallyHidden>, {d.map.hint}</VisuallyHidden>
                      </LinkButton>
                      <LinkButton
                        href={
                          map
                            ? `https://www.google.com/maps?q=${map.lat},${map.lng}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressUz ?? "")}`
                        }
                        variant="glass"
                        size="40"
                        external
                        externalHint={external}
                      >
                        {d.map.google}
                        <VisuallyHidden>, {d.map.hint}</VisuallyHidden>
                      </LinkButton>
                    </dd>
                  ) : null}
                  {fact.value && !fact.links ? (
                    /* Nusxa tugmasi har qatorda bir joyda: qiymat bilan bir chiziqda, oʻng chetda. */
                    <dd className="contact-row-actions">
                      <CopyButtonLeaf
                        value={fact.value}
                        label={d.details.copy}
                        copiedLabel={d.details.copied}
                        variant="glass"
                        size="40"
                        iconOnly
                      />
                    </dd>
                  ) : null}
                </div>
              ))}
              <div className="contact-row feature">
                <FeatureIcon name="share" />
                <dt className="sr-only">{d.socials.heading}</dt>
                {/* Tarmoqlar qiymat oʻrnida: nomlari bilan bir qatorda. */}
                <dd className="contact-row-value">
                  <ul className="contact-socials">
                    {socials.map((s) => (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social t-label text-ink"
                        >
                          <Icon name={s.id as IconName} size={20} />
                          {s.label}
                          <VisuallyHidden> ({external})</VisuallyHidden>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section labelledBy="contacts-write">
        <Container grid>
          <SectionHeader
            id="contacts-write"
            className="col-span-full"
            title={formEnabled ? d.form.heading : d.form.fallbackHeading}
            {...(!formEnabled && c.telegram.value
              ? {
                  actions: (
                    <LinkButton
                      href={c.telegram.value}
                      variant="primary"
                      size="48"
                      icon="telegram"
                      external
                      externalHint={external}
                    >
                      {d.form.fallbackCta}
                    </LinkButton>
                  ),
                }
              : {})}
          />
          {formEnabled ? (
            <div
              className="contact-write col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3"
              data-grid-item=""
            >
              <ContactFormLeaf dict={d.form} privacyHref={pathFor(locale, "privacy")} />
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
