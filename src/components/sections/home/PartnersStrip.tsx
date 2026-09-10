import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { PartnerGrid } from "@/components/sections/PartnerGrid";

/** Hamkorlar — teng tör, sokin bölim. */
export function PartnersStrip() {
  const t = useTranslations("home.partners");

  return (
    <section className="section-y" aria-labelledby="home-partners">
      <div className="page-w page-x">
        <SectionHead id="home-partners" heading={t("heading")} lead={t("lead")} />
        <Reveal delay={90}>
          <PartnerGrid className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
