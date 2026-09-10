import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Blob } from "@/components/brand/Blob";
import { Doodle } from "@/components/brand/Doodle";
import { Reveal } from "@/components/brand/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/sections/PageHeader";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(props: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("about.title"), description: t("meta.aboutDescription") };
}

const VALUES = [
  { key: "open", doodle: "circle", tone: "text-sun" },
  { key: "craft", doodle: "brush", tone: "text-coral" },
  { key: "stage", doodle: "star", tone: "text-grape" },
  { key: "region", doodle: "wave", tone: "text-grass" },
] as const;

function Values() {
  const t = useTranslations("about.values");

  return (
    <ul className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
      {VALUES.map((value, index) => (
        <li key={value.key}>
          <Reveal delay={index * 90} className="flex gap-4">
            <Doodle name={value.doodle} className={`mt-1 h-8 w-8 shrink-0 ${value.tone}`} strokeWidth={2.2} />
            <div>
              <h3 className="text-[1.24rem]">{t(`${value.key}Heading` as "openHeading")}</h3>
              <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-2">
                {t(`${value.key}Body` as "openBody")}
              </p>
            </div>
          </Reveal>
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
      <PageHeader title={t("title")} lead={t("lead")} accent="grass" />

      <section className="section-y relative isolate overflow-hidden" aria-labelledby="about-mission">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Blob name="petal" tone="text-sun-soft" className="-left-[40%] top-[10%] h-[24rem] w-[24rem] sm:-left-[26%] sm:h-[36rem] sm:w-[36rem]" />
        </div>

        <div className="page-w page-x">
          <Reveal>
            <h2 id="about-mission" className="max-w-3xl text-[clamp(1.8rem,4.2vw,2.6rem)]">
              {t("missionHeading")}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-[62ch] text-[1.14rem] leading-relaxed text-ink-2">
              {t("missionBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface-2/60" aria-labelledby="about-history">
        <div className="page-w page-x">
          <Reveal>
            <h2 id="about-history" className="text-[clamp(1.8rem,4.2vw,2.6rem)]">
              {t("historyHeading")}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-5 text-[1.06rem] leading-relaxed text-ink-2 lg:grid-cols-2 lg:gap-10">
            <Reveal delay={90}>
              <p>{t("historyBody1")}</p>
            </Reveal>
            <Reveal delay={170}>
              <p>{t("historyBody2")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y" aria-labelledby="about-values">
        <div className="page-w page-x">
          <Reveal>
            <h2 id="about-values" className="text-[clamp(1.8rem,4.2vw,2.6rem)]">
              {t("valuesHeading")}
            </h2>
          </Reveal>
          <Values />

          <Reveal delay={140}>
            <Button asChild size="lg" className="mt-12">
              <Link href="/projects">{tNav("projects")}</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
