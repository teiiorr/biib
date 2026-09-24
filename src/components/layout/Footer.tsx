import Link from "next/link";

import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { Islimiy } from "@/components/ornament/Islimiy";
import { IslimiyScroll } from "@/components/ornament/IslimiyScroll";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getContacts, getProjects, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor, type PageKey } from "@/i18n/routes";

import { Container } from "./Container";
import { DesignArt } from "./DesignArt";
import { FooterLangs } from "./FooterLangs";

interface FooterProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const ORG_LINKS: readonly PageKey[] = ["about", "leadership", "experts", "partners"];

/** Futer: Chust doʻppi hoshiyasi tepada, toʻrt guruh, pastki qator (15.10). */
export function Footer({ locale, dict }: FooterProps) {
  const contacts = getContacts();
  const projects = getProjects();
  const year = 2026;

  return (
    <footer className="site-footer" aria-label={dict.footer.label}>
      <Container>
        <div className="footer-crown" data-testid="footer-crown">
          <DesignArt slot="footer-crown" locale={locale} />
          <span className="footer-crown-line" aria-hidden="true" />
        </div>
        {/* Islimiy futerning yuqori qirrasi boʻylab oʻsadi: poya burilib, tojdan yuqorida yotadi. */}
        <div className="footer-islimiy birlashma:hidden" aria-hidden="true">
          <IslimiyScroll>
            <Islimiy length={640} width={48} seed="futer" side="left" scroll />
          </IslimiyScroll>
        </div>
        <div className="footer-groups">
          <div className="footer-group">
            <p className="t-label text-ink">{dict.footer.organization}</p>
            {ORG_LINKS.map((key) => (
              <Link key={key} href={pathFor(locale, key)} className="footer-link t-small">
                {dict.nav[key as "about"]}
              </Link>
            ))}
          </div>
          <div className="footer-group">
            <p className="t-label text-ink">{dict.footer.projects}</p>
            {projects.map((project) =>
              project.external ? (
                <ExternalLink
                  key={project.key}
                  href={project.external.href}
                  hint={dict.common.hints.external}
                  className="footer-link t-small text-ink-2 no-underline hover:text-tint"
                >
                  {t(project.name, locale)}
                </ExternalLink>
              ) : (
                <Link
                  key={project.key}
                  href={`${pathFor(locale, "projects")}#${project.key}`}
                  className="footer-link t-small"
                >
                  {t(project.name, locale)}
                </Link>
              ),
            )}
          </div>
          <div className="footer-group">
            <p className="t-label text-ink">{dict.footer.contacts}</p>
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
            <p className="t-small text-ink-3">{dict.contacts.details.pending}</p>
          </div>
          <div className="footer-group">
            <p className="t-label text-ink">{dict.footer.follow}</p>
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
          <p>{fill(dict.footer.copyright, { year })}</p>
          <Link href={pathFor(locale, "privacy")} className="footer-link">
            {dict.footer.privacy}
          </Link>
          <FooterLangs locale={locale} label={dict.nav.chooseLanguage} />
          <p className="footer-credit">{dict.footer.credit}</p>
        </div>
      </Container>
    </footer>
  );
}
