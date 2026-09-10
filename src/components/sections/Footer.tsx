import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Icon } from "@/components/brand/Icon";
import { LocaleMenu } from "./LocaleMenu";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_ITEMS } from "./nav-items";
import { Link } from "@/i18n/navigation";
import { BRAND_NAME, ORG } from "@/content/org";
import { PROJECTS } from "@/content/projects";
import { ORG_TEXT, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/** Podval: osmon, yumşoq belgilar va tört ustun. */
export function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-gradient-to-b from-footer-from to-footer-to">

      <div className="page-w page-x grid gap-12 pb-10 pt-20 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1.25fr] lg:gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image src="/brand/mark.png" alt="" width={112} height={112} sizes="56px" className="h-14 w-14" />
            <span className="flex flex-col leading-[1.15]">
              <span className="font-display text-[0.92rem] font-extrabold tracking-[0.01em] text-blue-deep">
                {BRAND_NAME.line1}
              </span>
              <span className="font-display text-[0.78rem] font-semibold tracking-[0.02em] text-ink-2">
                {BRAND_NAME.line2}
              </span>
            </span>
          </div>
          <p className="max-w-sm text-[1rem] text-ink-2">{t("org.tagline")}</p>

          <ul className="flex flex-wrap items-center gap-2.5">
            {ORG.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${social.label} (${t("common.opensInNewTab")})`}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-btn border border-line text-blue-deep",
                    "transition-[color,border-color,transform] duration-200 ease-[var(--ease-pop)]",
                    "hover:-translate-y-0.5 hover:border-line-strong hover:text-blue-cta",
                    "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
                  )}
                >
                  <Icon name={social.id} className="h-[1.25rem] w-[1.25rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-nav" className="flex flex-col gap-3.5">
          <h2 id="footer-nav" className="font-display text-[0.94rem] font-extrabold uppercase tracking-wide text-ink">
            {t("footer.navHeading")}
          </h2>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center text-[0.98rem] text-ink-2 transition-colors duration-200 hover:text-blue-deep"
              >
                {tNav("home")}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-[0.98rem] text-ink-2 transition-colors duration-200 hover:text-blue-deep"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-projects" className="flex flex-col gap-3.5">
          <h2 id="footer-projects" className="font-display text-[0.94rem] font-extrabold uppercase tracking-wide text-ink">
            {t("footer.projectsHeading")}
          </h2>
          <ul className="flex flex-col gap-0.5">
            {PROJECTS.map((project) => (
              <li key={project.id}>
                {project.external ? (
                  <a
                    href={project.external.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex min-h-11 items-center gap-1.5 text-[0.98rem] text-ink-2 transition-colors duration-200 hover:text-blue-deep"
                  >
                    {pick(project.name, locale)}
                    <Icon name="arrow-out" className="h-[0.95rem] w-[0.95rem] opacity-60" />
                    <span className="sr-only">({t("common.opensInNewTab")})</span>
                  </a>
                ) : (
                  <Link
                    href="/projects"
                    className="inline-flex min-h-11 items-center text-[0.98rem] text-ink-2 transition-colors duration-200 hover:text-blue-deep"
                  >
                    {pick(project.name, locale)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3.5">
          <h2 className="font-display text-[0.94rem] font-extrabold uppercase tracking-wide text-ink">
            {t("footer.contactsHeading")}
          </h2>
          <address className="flex flex-col gap-2.5 not-italic text-[0.98rem] text-ink-2">
            <span className="flex gap-2.5">
              <Icon name="pin" className="mt-0.5 h-[1.1rem] w-[1.1rem] shrink-0 text-blue" />
              <span>{pick(ORG_TEXT.address, locale)}</span>
            </span>
            {ORG.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="flex min-h-11 items-center gap-2.5 transition-colors duration-200 hover:text-blue-deep"
              >
                <Icon name="phone" className="h-[1.1rem] w-[1.1rem] shrink-0 text-blue" />
                <span>{phone}</span>
              </a>
            ))}
            <a
              href={`mailto:${ORG.email}`}
              className="flex min-h-11 items-center gap-2.5 transition-colors duration-200 hover:text-blue-deep"
            >
              <Icon name="mail" className="h-[1.1rem] w-[1.1rem] shrink-0 text-blue" />
              <span>{ORG.email}</span>
            </a>
          </address>
        </div>
      </div>

      <div className="page-w page-x border-t border-line py-6">
        {/*
         * Bir qatorga sığadigan kenglik xl dan boşlanadi. Undan pastda
         * ustma-ust turadi — yarim-yarim sinib qolgandan köra toza.
         */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
          <p className="max-w-xl text-[0.92rem] leading-relaxed text-ink-muted xl:max-w-[30rem]">
            © {year} {BRAND_NAME.full}. {t("footer.rights")}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 xl:flex-nowrap">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center whitespace-nowrap text-[0.92rem] text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-blue-deep hover:underline"
            >
              {t("footer.privacy")}
            </Link>
            <a
              href="https://teiior.uz"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center whitespace-nowrap text-[0.92rem] font-semibold text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-blue-deep hover:underline"
            >
              {t("footer.credit")}
            </a>
            <div className="flex shrink-0 items-center gap-2">
              <LocaleMenu />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
