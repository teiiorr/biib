import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { GirihStar } from "@/components/ornament/GirihStar";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getPartners, t } from "@/content";
import type { PartnerGroup } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const GROUPS: readonly PartnerGroup[] = ["state", "international", "creative", "sponsors"];

/** Hamkorlar: faqat haqiqiy tashkilotlar; roʻyxat boʻsh boʻlsa loyihalangan boʻsh holat va Aloqa havolasi. */
export function PartnersPage({ locale, dict }: PageProps) {
  const partners = getPartners().filter((p) => p.status !== "pending" && p.name);
  const p = dict.partners;
  return (
    <>
      <PageHero
        title={p.title}
        lead={p.lead}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "partners"), label: dict.nav.partners, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          {partners.length === 0 ? (
            <div className="empty-state paper-look">
              <GirihStar symmetry={8} size={24} ring={false} className="empty-state-mark" />
              <Text as="p" size="body-l" tone="ink-2" measure>
                {p.pending}
              </Text>
              <LinkButton
                href={pathFor(locale, "contacts")}
                variant="link"
                size="40"
                icon="arrow-right"
                iconPosition="end"
              >
                {p.invite}
              </LinkButton>
            </div>
          ) : (
            GROUPS.map((group) => {
              const items = partners.filter((x) => x.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="partner-group" data-card-group="">
                  <Heading level={2} size="h3">
                    {p.groups[group]}
                  </Heading>
                  <ul className="partner-grid" data-audit="gap">
                    {items.map((partner) => {
                      const name = partner.name ? t(partner.name, locale) : "";
                      const tile = (
                        <span className="partner-tile" data-card="">
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={fill(p.logoAlt, { name })}
                              width={240}
                              height={160}
                              className="partner-logo"
                            />
                          ) : (
                            <span className="t-label" data-card-title="">
                              {name}
                            </span>
                          )}
                        </span>
                      );
                      return (
                        <li key={partner.id}>
                          {partner.href ? (
                            <a
                              href={partner.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={fill(p.visit, { name })}
                            >
                              {tile}
                            </a>
                          ) : (
                            tile
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </Container>
      </Section>
    </>
  );
}
