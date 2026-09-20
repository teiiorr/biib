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

        {/* Bitta markaziy ustun — sarlavha, matn va tugma bir öqda. */}
        <div className="read mx-auto mt-6 flex flex-col gap-4 text-center">
          <Reveal delay={80} className="flex flex-col gap-4 text-body text-label-secondary">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-body text-label">{t("p3")}</p>
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-8 flex justify-center">
          <LinkButton href="/about" variant="secondary" className="w-full justify-center sm:w-auto">
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
