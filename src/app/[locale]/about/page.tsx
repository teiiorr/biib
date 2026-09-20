import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHead } from "@/components/sections/SectionHead";

export async function generateMetadata(props: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("about.title"), description: t("meta.aboutDescription") };
}

const VALUES = ["open", "craft", "stage", "region"] as const;

function Values() {
  const t = useTranslations("about.values");

  return (
    <ul className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
      {VALUES.map((value) => (
        <li key={value}>
          <h3 className="text-headline">{t(`${value}Heading` as "openHeading")}</h3>
          <p className="mt-2 text-callout text-label-secondary">
            {t(`${value}Body` as "openBody")}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="section" aria-labelledby="about-mission">
        <div className="page">
          <Reveal>
            <SectionHead id="about-mission" heading={t("missionHeading")} />
            <p className="read mx-auto mt-4 text-center text-body text-label-secondary">
              {t("missionBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="panel section" aria-labelledby="about-history">
        <div className="page">
          <Reveal>
            <SectionHead id="about-history" heading={t("historyHeading")} />
            <div className="mt-5 grid gap-5 text-body text-label-secondary lg:grid-cols-2 lg:gap-10">
              <p>{t("historyBody1")}</p>
              <p>{t("historyBody2")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="about-values">
        <div className="page">
          <Reveal>
            <SectionHead id="about-values" heading={t("valuesHeading")} />
          </Reveal>
          <Values />

          <div className="mt-10 flex justify-end">
            <LinkButton href="/projects">{tNav("projects")}</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
