import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getContacts, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { contactFormEnabled } from "@/lib/contact/config";

import { ContactFormLeaf, CopyButtonLeaf } from "../lazy-leaves";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

interface DetailRow {
  readonly key: string;
  readonly icon: IconName;
  readonly label: string;
  readonly value: string | null;
  readonly href?: string;
}

/**
 * Aloqa: chapda rekvizitlar (nusxa tugmasi bilan), oʻngda xarita, tarmoqlar va yozish bloki (shakl
 * yoki Telegram zaxirasi) — ikki ustun bir balandlikda tugaydi, alohida boʻlim ochilmaydi.
 */
export function ContactsPage({ locale, dict }: PageProps) {
  const c = getContacts();
  const d = dict.contacts;
  const formEnabled = contactFormEnabled();
  const phone = c.phones.value?.[0] ?? null;
  const rows: DetailRow[] = [
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
      value: phone,
      ...(phone ? { href: `tel:${phone.replace(/\s/g, "")}` } : {}),
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

  return (
    <>
      <PageHero
        title={d.title}
        lead={d.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "contacts"), label: dict.nav.contacts, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section labelledBy="contacts-details">
        <Container grid className="contact-grid">
          <div className="col-span-4 md:col-span-8 lg:col-span-6" data-grid-item="">
            <Heading level={2} size="h3" id="contacts-details">
              {d.details.heading}
            </Heading>
            <Reveal
              as="dl"
              className="contact-details"
              stagger
              distance={16}
              attrs={{ "data-audit": "gap" }}
            >
              {rows.map((row) => (
                <div key={row.key} className="contact-row">
                  <dt className="t-label text-ink-2 contact-row-label">
                    <Icon name={row.icon} size={20} />
                    {row.label}
                  </dt>
                  <dd className="contact-row-value">
                    {row.value ? (
                      <>
                        {row.href ? (
                          <a
                            href={row.href}
                            className="t-body tnum text-ink"
                            {...(row.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {row.value}
                          </a>
                        ) : (
                          <span className="t-body tnum">{row.value}</span>
                        )}
                        <CopyButtonLeaf
                          value={row.value}
                          label={d.details.copy}
                          copiedLabel={d.details.copied}
                          variant="ghost"
                          size="40"
                        />
                      </>
                    ) : (
                      <span className="t-body text-ink-3">{d.details.pending}</span>
                    )}
                  </dd>
                </div>
              ))}
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 contact-aside" data-grid-item="">
            <div className="contact-aside-block">
              <Heading level={2} size="h3">
                {d.map.heading}
              </Heading>
              {map ? (
                <div className="flex flex-wrap justify-end gap-3">
                  <LinkButton
                    href={`https://yandex.uz/maps/?pt=${map.lng},${map.lat}&z=16`}
                    variant="glass"
                    external
                    externalHint={dict.common.hints.external}
                  >
                    {d.map.yandex}
                  </LinkButton>
                  <LinkButton
                    href={`https://www.google.com/maps?q=${map.lat},${map.lng}`}
                    variant="glass"
                    external
                    externalHint={dict.common.hints.external}
                  >
                    {d.map.google}
                  </LinkButton>
                </div>
              ) : (
                <Text as="p" tone="ink-3">
                  {d.map.pending}
                </Text>
              )}
            </div>
            <div className="contact-aside-block">
              <Heading level={2} size="h3">
                {d.socials.heading}
              </Heading>
              <ul className="flex flex-wrap gap-3">
                {c.socials
                  .filter((s) => s.status === "confirmed")
                  .map((s) => (
                    <li key={s.id}>
                      <LinkButton
                        href={s.href}
                        variant="glass"
                        size="40"
                        icon={s.id as IconName}
                        external
                        externalHint={dict.common.hints.external}
                      >
                        {s.label}
                      </LinkButton>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="contact-write">
              <Heading level={2} size="h3" id="contacts-form">
                {formEnabled ? d.form.heading : d.form.fallbackHeading}
              </Heading>
              {formEnabled ? (
                <ContactFormLeaf dict={d.form} privacyHref={pathFor(locale, "privacy")} />
              ) : (
                <>
                  <Text as="p" tone="ink-2" measure>
                    {d.form.fallbackText}
                  </Text>
                  {c.telegram.value ? (
                    <div>
                      <LinkButton
                        href={c.telegram.value}
                        variant="primary"
                        size="48"
                        icon="telegram"
                        external
                        externalHint={dict.common.hints.external}
                      >
                        {d.form.fallbackCta}
                      </LinkButton>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
