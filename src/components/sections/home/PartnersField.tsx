import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { t } from "@/content";
import type { Partner } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PartnersFieldProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly partners: readonly Partner[];
}

/** Hamkorlar maydoni: faqat haqiqiy logotiplar, siyoh rangida, hover/fokusda asl rang (15.2.6). */
export function PartnersField({ locale, dict, partners }: PartnersFieldProps) {
  const h = dict.home.partners;
  return (
    <Section labelledBy="home-partners" tone="light">
      <Container>
        <div className="section-head-row">
          <Heading level={2} size="h2" id="home-partners">
            {h.heading}
          </Heading>
          <LinkButton
            href={pathFor(locale, "partners")}
            variant="ghost"
            size="40"
            icon="arrow-right"
            iconPosition="end"
          >
            {h.all}
          </LinkButton>
        </div>
        <ul className="partner-grid" data-card-group="">
          {partners.map((partner) => {
            const name = partner.name ? t(partner.name, locale) : "";
            return (
              <li key={partner.id} data-card="">
                <a
                  href={partner.href ?? pathFor(locale, "partners")}
                  className="partner-tile"
                  aria-label={fill(dict.partners.visit, { name })}
                >
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={fill(dict.partners.logoAlt, { name })}
                      width={240}
                      height={160}
                      className="partner-logo"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
