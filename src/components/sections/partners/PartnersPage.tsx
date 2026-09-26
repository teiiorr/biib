import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { LinkButton } from "@/components/ui/LinkButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Picture } from "@/components/ui/Picture";
import { getPartners, t } from "@/content";
import { fillerName } from "@/content/placeholder";
import type { Partner, PartnerGroup } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const GROUPS: readonly PartnerGroup[] = ["state", "international", "creative", "sponsors"];
/* Toʻliq maydon: shundan kam boʻlsa guruhlarga boʻlinmaydi, bitta toʻr oʻrinbosarlar bilan toʻldiriladi. */
const FULL_FIELD = 6;

interface PartnerTileProps {
  readonly partner: Partner;
  readonly locale: Locale;
  readonly dict: Dictionary["partners"];
}

function PartnerTile({ partner, locale, dict }: PartnerTileProps) {
  const name = partner.name ? t(partner.name, locale) : "";
  const tile = (
    <span className="partner-tile" data-card="">
      {partner.logo ? (
        <Picture
          src={partner.logo}
          alt={fill(dict.logoAlt, { name })}
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
    <li>
      {partner.href ? (
        <a
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fill(dict.visit, { name })}
        >
          {tile}
        </a>
      ) : (
        tile
      )}
    </li>
  );
}

/**
 * Hamkorlar: faqat haqiqiy tashkilotlar. Oltitadan kam boʻlsa bitta toʻr (haqiqiylari birinchi), aks holda
 * har guruh markazdagi sarlavha ostida teng plitkalar toʻrida.
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
      {partners.length < FULL_FIELD ? (
        /* Hamkorlar kam boʻlsa (egasining talabi — boʻsh joy emas): bitta toʻr, avval haqiqiy logotiplar,
           qolgani oʻrinbosar plitkalar bilan toʻldiriladi; guruh sarlavhalari yoʻq, taklif tugmasi oʻngda. */
        <Section>
          <Container>
            <ul className="partner-grid" data-card-group="" data-audit="gap">
              {partners.map((partner) => (
                <PartnerTile key={partner.id} partner={partner} locale={locale} dict={p} />
              ))}
              {Array.from({ length: FULL_FIELD - partners.length }, (_, index) => (
                <li key={`filler-${index}`}>
                  <span className="partner-tile partner-tile-placeholder feature" data-card="">
                    <FeatureIcon name="building" />
                    <span className="t-label text-ink-2">{fillerName(index)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="partners-invite">
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
                {items.map((partner) => (
                  <PartnerTile key={partner.id} partner={partner} locale={locale} dict={p} />
                ))}
              </ul>
            </Container>
          </Section>
        ))
      )}
    </>
  );
}
