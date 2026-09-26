import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { Picture } from "@/components/ui/Picture";
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

/**
 * Hamkorlar: faqat haqiqiy tashkilotlar, har guruh markazdagi sarlavha ostida teng plitkalar toʻrida.
 * Roʻyxat boʻsh boʻlsa bitta tinch karta: halol holat chapda, Aloqa havolasi oʻngda.
 */
export function PartnersPage({ locale, dict }: PageProps) {
  const partners = getPartners().filter((p) => p.status !== "pending" && p.name);
  const p = dict.partners;
  const groups = GROUPS.map((group) => ({
    group,
    items: partners.filter((x) => x.group === group),
  })).filter((g) => g.items.length > 0);
  return (
    <>
      <PageHero
        title={p.title}
        band
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "partners"), label: dict.nav.partners, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      {groups.length === 0 ? (
        <Section>
          <Container grid>
            <div
              className="partners-empty col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3"
              data-grid-item=""
            >
              <p className="t-body text-ink-2">{p.pending}</p>
              <LinkButton
                href={pathFor(locale, "contacts")}
                variant="glass"
                size="48"
                icon="arrow-right"
                iconPosition="end"
              >
                {p.invite}
              </LinkButton>
            </div>
          </Container>
        </Section>
      ) : (
        groups.map(({ group, items }) => (
          <Section key={group} labelledBy={`partners-${group}`}>
            <Container>
              <SectionHeader id={`partners-${group}`} title={p.groups[group]} />
              <ul className="partner-grid" data-card-group="" data-audit="gap">
                {items.map((partner) => {
                  const name = partner.name ? t(partner.name, locale) : "";
                  const tile = (
                    <span className="partner-tile" data-card="">
                      {partner.logo ? (
                        <Picture
                          src={partner.logo}
                          alt={fill(p.logoAlt, { name })}
                          width={240}
                          height={160}
                          className="partner-logo"
                        />
                      ) : (
                        <span className="t-label text-center" data-card-title="">
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
            </Container>
          </Section>
        ))
      )}
    </>
  );
}
