import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Icon, type IconName } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { ORG, ORG_TEXT, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

export async function generateMetadata(props: PageProps<"/[locale]/contacts">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("contacts.title"), description: t("meta.contactsDescription") };
}

const ROW_LINK =
  "inline-flex min-h-8 items-center text-callout text-accent-text transition-colors duration-[var(--dur-fast)] hover:text-accent";

async function Details() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contacts");
  const tCommon = await getTranslations("common");

  const rows: readonly {
    id: string;
    icon: IconName;
    label: string;
    value: string;
    link?: { href: string; label: string; external?: boolean };
  }[] = [
    {
      id: "address",
      icon: "pin",
      label: t("addressLabel"),
      value: pick(ORG_TEXT.address, locale),
      link: { href: ORG.mapUrl, label: pick(ORG_TEXT.mapLabel, locale), external: true },
    },
    {
      id: "phone",
      icon: "phone",
      label: t("phoneLabel"),
      value: ORG.phones.join("   "),
      link: { href: `tel:${ORG.phones[0]?.replace(/[^+\d]/g, "") ?? ""}`, label: ORG.phones[0] ?? "" },
    },
    {
      id: "email",
      icon: "mail",
      label: t("emailLabel"),
      value: ORG.email,
      link: { href: `mailto:${ORG.email}`, label: ORG.email },
    },
    {
      id: "hours",
      icon: "clock",
      label: t("hoursLabel"),
      value: pick(ORG_TEXT.hours, locale),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col">
        {rows.map((row, index) => (
          <li
            key={row.id}
            className={cn("flex gap-3 py-4", index > 0 && "border-t border-separator")}
          >
            <Icon name={row.icon} className="mt-0.5 h-5 w-5 shrink-0 text-label-tertiary" />
            <div className="min-w-0">
              <p className="text-subhead text-label-secondary">{row.label}</p>
              <p className="mt-0.5 break-words text-body text-label">{row.value}</p>
              {row.link ? (
                <a
                  href={row.link.href}
                  target={row.link.external ? "_blank" : undefined}
                  rel={row.link.external ? "noreferrer noopener" : undefined}
                  className={cn(ROW_LINK, "mt-1 gap-1.5")}
                >
                  {row.link.label}
                  {row.link.external ? (
                    <>
                      <Icon name="arrow-out" className="h-3.5 w-3.5" />
                      <span className="sr-only">({tCommon("opensInNewTab")})</span>
                    </>
                  ) : null}
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <p className="text-subhead text-label-secondary">{t("socialLabel")}</p>
        <ul className="mt-2 flex flex-wrap gap-1">
          {ORG.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${social.label} (${tCommon("opensInNewTab")})`}
                className="tap grid h-10 w-10 place-items-center rounded-sm text-label-secondary transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary hover:text-label"
              >
                <Icon name={social.id} className="h-[1.15rem] w-[1.15rem]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function ContactsPage({ params }: PageProps<"/[locale]/contacts">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contacts" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="section pt-4">
        <div className="page grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <Details />
          </Reveal>

          <Reveal delay={120} className="panel panel-line rounded-lg p-5 md:p-7">
            <h2 className="text-title2">{t("formHeading")}</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
