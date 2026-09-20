import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/brand/Reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { SectionHead } from "@/components/sections/SectionHead";

export async function generateMetadata(props: PageProps<"/[locale]/partners">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("partners.title"), description: t("meta.partnersDescription") };
}

export default async function PartnersPage({ params }: PageProps<"/[locale]/partners">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="section pt-4">
        <div className="page">
          <Reveal>
            <PartnerGrid />
          </Reveal>
        </div>
      </section>

      <section className="panel section pt-0" aria-labelledby="become-partner">
        <div className="page pt-12">
          <Reveal>
            <SectionHead id="become-partner" heading={t("becomeHeading")} lead={t("becomeBody")} />
          </Reveal>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/contacts" size="lg">
              {t("becomeCta")}
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
