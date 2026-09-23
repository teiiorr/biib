import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Text } from "@/components/ui/Text";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const UPDATED = "2026-09-24";

/** Maxfiylik: bolalar uchun qisqa xulosa, kompyuterda yopishqoq mundarija, boʻlimlar. */
export function PrivacyPage({ locale, dict }: PageProps) {
  const p = dict.privacy;
  return (
    <>
      <PageHero
        title={p.title}
        lead={p.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "privacy"), label: dict.nav.privacy, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      >
        <Text as="p" size="small" tone="ink-3" tnum>
          {fill(p.updated, { date: formatDate(locale, UPDATED) })}
        </Text>
        <Text as="p" size="small" tone="ink-3">
          {p.legalPending}
        </Text>
      </PageHero>
      <Section labelledBy="privacy-kid">
        <Container>
          <div className="privacy-kid" data-grid-item="">
            <Heading level={2} size="h3" id="privacy-kid">
              {p.kid.heading}
            </Heading>
            <ul className="privacy-kid-list t-body-l">
              {p.kid.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <Section padded={false} className="pb-12 lg:pb-24">
        <Container grid>
          <nav
            className="col-span-4 md:col-span-8 lg:col-span-3 privacy-toc"
            aria-label={p.toc}
            data-grid-item=""
          >
            <p className="t-label text-ink-2">{p.toc}</p>
            <ol className="privacy-toc-list">
              {p.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="t-small privacy-toc-link">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5" data-grid-item="">
            {p.sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="privacy-section"
                aria-labelledby={`${s.id}-h`}
              >
                <Heading level={2} size="h3" id={`${s.id}-h`}>
                  {s.heading}
                </Heading>
                <Prose>
                  {s.paragraphs.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                  {s.id === "contact" ? (
                    <p>
                      <Link href={pathFor(locale, "contacts")} className="text-tint underline">
                        {dict.nav.contacts}
                      </Link>
                    </p>
                  ) : null}
                </Prose>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
