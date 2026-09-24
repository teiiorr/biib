import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getContacts, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { contactFormEnabled } from "@/lib/contact/config";

import { ContactForm } from "./ContactForm";

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

/** Aloqa: rekvizitlar nusxa tugmasi bilan, xarita havolalari, shakl yoki Telegram zaxirasi. */
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
        <Container grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-6" data-grid-item="">
            <Heading level={2} size="h2" id="contacts-details">
              {d.details.heading}
            </Heading>
            <dl className="contact-details" data-audit="gap">
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
                        <CopyButton
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
            </dl>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6" data-grid-item="">
            <Heading level={2} size="h2">
              {d.map.heading}
            </Heading>
            {map ? (
              <div className="flex flex-wrap gap-3 pt-4">
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
              <Text as="p" tone="ink-3" className="pt-4">
                {d.map.pending}
              </Text>
            )}
            <Heading level={2} size="h3" className="pt-8">
              {d.socials.heading}
            </Heading>
            <ul className="flex flex-wrap gap-3 pt-4">
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
        </Container>
      </Section>
      <Section labelledBy="contacts-form" className="relative">
        <Container grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3" data-grid-item="">
            <DesignArt
              slot="contacts-band"
              locale={locale}
              meaningful
              copy={{ postcardLabel: d.form.postcardLabel }}
            >
              <Heading level={2} size="h2" id="contacts-form">
                {formEnabled ? d.form.heading : d.form.fallbackHeading}
              </Heading>
              {formEnabled ? (
                <ContactForm dict={d.form} privacyHref={pathFor(locale, "privacy")} />
              ) : (
                <div className="grid gap-4 pt-4">
                  <Text as="p" tone="ink-2" measure>
                    {d.form.fallbackText}
                  </Text>
                  {c.telegram.value ? (
                    <div>
                      <LinkButton
                        href={c.telegram.value}
                        variant="primary"
                        size="56"
                        icon="telegram"
                        external
                        externalHint={dict.common.hints.external}
                      >
                        {d.form.fallbackCta}
                      </LinkButton>
                    </div>
                  ) : null}
                </div>
              )}
            </DesignArt>
          </div>
        </Container>
      </Section>
    </>
  );
}
