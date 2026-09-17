import { useTranslations } from "next-intl";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { SectionHead } from "@/components/sections/SectionHead";

export function PartnersStrip() {
  const t = useTranslations("home.partners");

  return (
    <section className="section" aria-labelledby="home-partners">
      <div className="page">
        <SectionHead id="home-partners" heading={t("heading")} lead={t("lead")} />
        <PartnerGrid className="mt-8" />
      </div>
    </section>
  );
}
