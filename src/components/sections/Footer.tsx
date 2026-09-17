import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Icon } from "@/components/brand/Icon";
import { AppearanceMenu } from "./AppearanceMenu";
import { LocaleMenu } from "./LocaleMenu";
import { NAV_ITEMS } from "./nav-items";
import { Link } from "@/i18n/navigation";
import { BRAND_NAME, ORG, ORG_TEXT, PROJECTS, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

const COLUMN_HEADING = "text-subhead font-semibold text-label";
const ROW_LINK =
  "inline-flex min-h-8 items-center text-callout text-label-secondary transition-colors duration-[var(--dur-fast)] hover:text-label";

/** Podval — qattiq yuza. Şişa faqat suzuvçi chrome da (§3). */
export function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="panel mt-16 shadow-[inset_0_0.5px_0_0_var(--line-gold)]">
      <div className="page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/mark.png" alt="" width={96} height={96} sizes="40px" className="h-10 w-10" />
            <span className="flex flex-col leading-tight">
              <span className="text-subhead font-semibold text-label">{BRAND_NAME.line1}</span>
              <span className="text-caption text-label-secondary">{BRAND_NAME.line2}</span>
            </span>
          </div>

          <p className="max-w-sm text-callout text-label-secondary">{t("org.tagline")}</p>

          <ul className="flex flex-wrap items-center gap-1">
            {ORG.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${social.label} (${t("common.opensInNewTab")})`}
                  className={cn(
                    "tap grid h-10 w-10 place-items-center rounded-sm text-label-secondary",
                    "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary hover:text-label",
                  )}
                >
                  <Icon name={social.id} className="h-[1.15rem] w-[1.15rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-nav" className="flex flex-col gap-3">
          <h2 id="footer-nav" className={COLUMN_HEADING}>
            {t("footer.navHeading")}
          </h2>
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={ROW_LINK}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-projects" className="flex flex-col gap-3">
          <h2 id="footer-projects" className={COLUMN_HEADING}>
            {t("footer.projectsHeading")}
          </h2>
          <ul className="flex flex-col gap-1">
            {PROJECTS.map((project) => (
              <li key={project.id}>
                {project.external ? (
                  <a
                    href={project.external.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(ROW_LINK, "gap-1.5")}
                  >
                    {pick(project.name, locale)}
                    <Icon name="arrow-out" className="h-3.5 w-3.5 opacity-70" />
                    <span className="sr-only">({t("common.opensInNewTab")})</span>
                  </a>
                ) : (
                  <Link href="/projects" className={ROW_LINK}>
                    {pick(project.name, locale)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className={COLUMN_HEADING}>{t("footer.contactsHeading")}</h2>
          <address className="flex flex-col gap-1 not-italic text-callout text-label-secondary">
            <span className="flex gap-2 py-1">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-label-tertiary" />
              <span>{pick(ORG_TEXT.address, locale)}</span>
            </span>
            {ORG.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className={cn(ROW_LINK, "gap-2")}
              >
                <Icon name="phone" className="h-4 w-4 shrink-0 text-label-tertiary" />
                {phone}
              </a>
            ))}
            <a href={`mailto:${ORG.email}`} className={cn(ROW_LINK, "gap-2")}>
              <Icon name="mail" className="h-4 w-4 shrink-0 text-label-tertiary" />
              {ORG.email}
            </a>
          </address>
        </div>
      </div>

      <div className="page border-t border-separator py-5">
        {/*
         * Bir qatorga sığadigan kenglik xl dan boşlanadi. Undan pastda
         * ustma-ust turadi — yarim-yarim sinib qolgandan köra toza.
         */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
          <p className="max-w-xl text-caption text-label-secondary xl:max-w-[30rem]">
            © {year} {BRAND_NAME.full}. {t("footer.rights")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 xl:flex-nowrap">
            <Link
              href="/privacy"
              className="tap inline-flex min-h-10 items-center whitespace-nowrap text-caption text-label-secondary transition-colors duration-[var(--dur-fast)] hover:text-label"
            >
              {t("footer.privacy")}
            </Link>

            {/* §15: Caption, tagi çizilmaydi, podval törida tekis turadi. */}
            <a
              href="https://teiior.uz"
              target="_blank"
              rel="noreferrer noopener"
              className="tap inline-flex min-h-10 items-center whitespace-nowrap text-caption text-label-secondary no-underline transition-colors duration-[var(--dur-fast)] hover:text-label"
            >
              {t("footer.credit")}
            </a>

            <div className="flex shrink-0 items-center gap-1">
              <LocaleMenu />
              <AppearanceMenu />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
