import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Icon, type IconName } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { ORG, ORG_TEXT, pick } from "@/content";
import type { Locale } from "@/i18n/locales";

export async function generateMetadata(props: PageProps<"/[locale]/contacts">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("contacts.title"), description: t("meta.contactsDescription") };
}

interface ContactRow {
  readonly id: string;
  readonly icon: IconName;
  /** Boş satr — yuqoridagi qatorning davomi (masalan ikkinçi telefon). */
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  /** Qiymatdan farq qiladigan havola matni. Bölmasa qiymatning özi havola. */
  readonly hrefLabel?: string;
  readonly external?: boolean;
}

async function Details() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contacts");
  const tCommon = await getTranslations("common");

  const rows: readonly ContactRow[] = [
    {
      id: "address",
      icon: "pin" as const,
      label: t("addressLabel"),
      value: pick(ORG_TEXT.address, locale),
      href: ORG.mapUrl,
      hrefLabel: pick(ORG_TEXT.mapLabel, locale),
      external: true,
    },
    ...ORG.phones.map((phone, index) => ({
      id: `phone-${index}`,
      icon: "phone" as const,
      label: index === 0 ? t("phoneLabel") : "",
      value: phone,
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
      external: false,
    })),
    {
      id: "email",
      icon: "mail" as const,
      label: t("emailLabel"),
      value: ORG.email,
      href: `mailto:${ORG.email}`,
      external: false,
    },
    {
      id: "hours",
      icon: "clock" as const,
      label: t("hoursLabel"),
      value: pick(ORG_TEXT.hours, locale),
      external: false,
    },
  ];

  return (
    <div className="flex flex-col gap-7">
      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <li key={row.id} className="flex gap-4 py-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-blue-soft text-blue-deep">
              <Icon name={row.icon} className="h-[1.25rem] w-[1.25rem]" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[0.92rem] font-extrabold uppercase tracking-wide text-ink-muted">
                {row.label}
              </p>
              {row.href && !row.hrefLabel ? (
                <a
                  href={row.href}
                  className="mt-1 inline-flex min-h-11 items-center break-words text-[1.04rem] text-ink underline-offset-4 transition-colors duration-200 hover:text-blue-deep hover:underline"
                >
                  {row.value}
                </a>
              ) : (
                <p className="mt-1 break-words text-[1.04rem] text-ink">{row.value}</p>
              )}

              {/* Qöşimça havola faqat matndan farq qilsa körsatiladi. */}
              {row.href && row.hrefLabel ? (
                <a
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel={row.external ? "noreferrer noopener" : undefined}
                  className="mt-1.5 inline-flex min-h-11 items-center gap-1.5 text-[0.96rem] font-semibold text-blue-deep underline-offset-4 hover:underline"
                >
                  {row.hrefLabel}
                  {row.external ? (
                    <>
                      <Icon name="arrow-out" className="h-[0.9rem] w-[0.9rem]" />
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
        <p className="font-display text-[0.92rem] font-extrabold uppercase tracking-wide text-ink-muted">
          {t("socialLabel")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {ORG.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${social.label} (${tCommon("opensInNewTab")})`}
                className="grid h-11 w-11 place-items-center rounded-btn border border-line text-blue-deep transition-[color,border-color,transform] duration-200 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:border-line-strong hover:text-blue-cta focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
              >
                <Icon name={social.id} className="h-[1.25rem] w-[1.25rem]" />
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
      <PageHeader title={t("title")} lead={t("lead")} accent="grass" />

      <section className="section-y pt-10">
        <div className="page-w page-x grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal>
            <Details />
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft sm:p-9">
              <h2 className="text-[clamp(1.6rem,3.6vw,2.1rem)]">{t("formHeading")}</h2>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
