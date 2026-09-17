import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHead } from "@/components/sections/SectionHead";

export function AboutTeaser() {
  const t = useTranslations("home.about");

  return (
    <section className="section bg-elevated" aria-labelledby="home-about">
      <div className="page">
        <SectionHead id="home-about" heading={t("heading")} />

        <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-4 text-body text-label-secondary">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
          <p className="text-body text-label">{t("p3")}</p>
        </div>

        <div className="mt-8 flex justify-end">
          <LinkButton href="/about" variant="secondary">
            {t("cta")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
