import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { LinkButton } from "@/components/ui/LinkButton";

export function AboutTeaser() {
  const t = useTranslations("home.about");

  return (
    <section className="panel section relative isolate overflow-hidden" aria-labelledby="home-about">
      <div className="page relative">
        <Reveal>
          <SectionHead id="home-about" heading={t("heading")} />
        </Reveal>

        <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:gap-10">
          <Reveal delay={80} className="flex flex-col gap-4 text-body text-label-secondary">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-body text-label">{t("p3")}</p>
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-8 flex justify-end">
          <LinkButton href="/about" variant="secondary">
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
