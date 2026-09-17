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
      <PageHeader title={t("privacyTitle")} lead={t("privacyLead")} />

      <section className="section pt-4">
        <div className="page">
          <div className="read flex flex-col gap-7">
            {BLOCKS.map((block, index) => (
              <Reveal key={block} delay={index * 70}>
                <h2 className="text-title3">{t(`${block}Heading` as "collectHeading")}</h2>
                <p className="mt-2 text-body text-label-secondary">
                  {t(`${block}Body` as "collectBody")}
                </p>
                {block === "rights" ? (
                  <p className="mt-2">
                    <a href={`mailto:${ORG.email}`} className="text-body font-semibold text-accent-text">
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
