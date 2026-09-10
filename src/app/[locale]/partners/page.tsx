import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Doodle } from "@/components/brand/Doodle";
import { Reveal } from "@/components/brand/Reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

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
      <PageHeader title={t("title")} lead={t("lead")} accent="grape" />

      <section className="section-y pt-12">
        <div className="page-w page-x">
          <Reveal>
            <PartnerGrid />
          </Reveal>
        </div>
      </section>

      <section className="section-y pt-0" aria-labelledby="become-partner">
        <div className="page-w page-x">
          <Reveal pop>
            <div className="flex flex-col items-start gap-5 rounded-[1.75rem] border border-line bg-grape-soft p-8 sm:p-12">
              <h2 id="become-partner" className="flex items-center gap-3 text-[clamp(1.7rem,4vw,2.4rem)]">
                {t("becomeHeading")}
                <Doodle name="heart" className="h-7 w-7 text-grape" strokeWidth={2.2} />
              </h2>
              <p className="max-w-xl text-[1.06rem] leading-relaxed text-ink-2">{t("becomeBody")}</p>
              <Button asChild size="lg">
                <Link href="/contacts">{t("becomeCta")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
