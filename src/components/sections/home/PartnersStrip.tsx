import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { SectionHead } from "@/components/sections/SectionHead";

export function PartnersStrip() {
  const t = useTranslations("home.partners");

  return (
    <section className="section" aria-labelledby="home-partners">
      <div className="page">
        <Reveal>
          <SectionHead id="home-partners" heading={t("heading")} lead={t("lead")} />
        </Reveal>
        <Reveal delay={90}>
          <PartnerGrid className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
