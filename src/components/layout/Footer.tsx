import Link from "next/link";

import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getContacts, getFlagship } from "@/content";
import { FILLER } from "@/content/placeholder";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor, type PageKey } from "@/i18n/routes";

import { Container } from "./Container";
import { FooterArrive } from "./FooterArrive";
import { FooterLangs } from "./FooterLangs";

interface FooterProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const ORG_LINKS: readonly PageKey[] = ["about", "leadership", "experts", "partners"];

/** Futer: tepada ingichka ajratuvchi chiziq, toʻrt guruh, pastki qator (15.10); kirishi FooterArrive da. */
export function Footer({ locale, dict }: FooterProps) {
  const contacts = getContacts();
  const flagship = getFlagship();
  const year = 2026;

  return (
    <footer className="site-footer" aria-label={dict.footer.label} data-testid="footer">
      <FooterArrive />
      <Container>
        <div className="footer-groups">
          <div className="footer-group">
            <p className="t-label text-ink footer-group-label">{dict.footer.organization}</p>
            {ORG_LINKS.map((key) => (
              <Link key={key} href={pathFor(locale, key)} className="footer-link t-small">
                {dict.nav[key as "about"]}
              </Link>
            ))}
          </div>
          <div className="footer-group">
            <p className="t-label text-ink footer-group-label">{dict.footer.projects}</p>
            <Link href={pathFor(locale, "projects")} className="footer-link t-small">
              {dict.nav.projects}
            </Link>
            <ExternalLink
              href={flagship.external.href}
              hint={dict.common.hints.external}
              className="footer-link t-small text-ink-2 no-underline hover:text-tint"
            >
              {dict.nav.upop}
            </ExternalLink>
          </div>
          <div className="footer-group">
            <p className="t-label text-ink footer-group-label">{dict.footer.contacts}</p>
            <Link href={pathFor(locale, "contacts")} className="footer-link t-small">
              {dict.nav.contacts}
            </Link>
            {contacts.telegram.value ? (
              <a
                href={contacts.telegram.value}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link t-small"
              >
                Telegram
              </a>
            ) : null}
            <p className="t-small text-ink-3 footer-note">{FILLER.line}</p>
          </div>
          <div className="footer-group">
            <p className="t-label text-ink footer-group-label">{dict.footer.follow}</p>
            {contacts.socials
              .filter((s) => s.status === "confirmed")
              .map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link t-small gap-2"
                >
                  <Icon name={s.id as IconName} size={16} />
                  {s.label}
                </a>
              ))}
          </div>
        </div>
        <div className="footer-bottom t-small">
          <p className="footer-copy">{fill(dict.footer.copyright, { year })}</p>
          <Link href={pathFor(locale, "privacy")} className="footer-link footer-privacy">
            {dict.footer.privacy}
          </Link>
          <FooterLangs locale={locale} label={dict.nav.chooseLanguage} />
          <p className="footer-credit">{dict.footer.credit}</p>
        </div>
      </Container>
    </footer>
  );
}
