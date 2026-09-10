import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/brand/Reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { ORG } from "@/content";

export async function generateMetadata(props: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle"), description: t("privacyLead"), robots: { index: false } };
}

const BLOCKS = ["collect", "use", "store", "cookies", "rights"] as const;

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <>
      <PageHeader title={t("privacyTitle")} lead={t("privacyLead")} accent="blue" />

      <section className="section-y pt-10">
        <div className="page-w page-x">
          <div className="flex max-w-[44rem] flex-col gap-9">
            {BLOCKS.map((block, index) => (
              <Reveal key={block} delay={index * 70}>
                <h2 className="text-[1.4rem] sm:text-[1.55rem]">
                  {t(`${block}Heading` as "collectHeading")}
                </h2>
                <p className="mt-3 text-[1.06rem] leading-relaxed text-ink-2">
                  {t(`${block}Body` as "collectBody")}
                </p>
                {block === "rights" ? (
                  <p className="mt-3">
                    <a
                      href={`mailto:${ORG.email}`}
                      className="text-[1.06rem] font-semibold text-blue-deep underline underline-offset-4"
                    >
                      {ORG.email}
                    </a>
                  </p>
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
