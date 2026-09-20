import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/brand/Reveal";
import { OrnamentBand } from "@/components/brand/Ornament";
import { Hero } from "@/components/sections/home/Hero";
import { Flagship } from "@/components/sections/home/Flagship";
import { ProjectsOverview } from "@/components/sections/home/ProjectsOverview";
import { AboutTeaser } from "@/components/sections/home/AboutTeaser";
import { LatestNews } from "@/components/sections/home/LatestNews";
import { PeopleTeaser } from "@/components/sections/home/PeopleTeaser";
import { PartnersStrip } from "@/components/sections/home/PartnersStrip";
import { ClosingCta } from "@/components/sections/home/ClosingCta";

/** Bölimlarni bogʻlaydigan naqş ajratgiçi — sahifa ritmiga urgʻu. */
function SectionDivider() {
  return (
    <Reveal className="page">
      <OrnamentBand className="my-2 md:my-4" />
    </Reveal>
  );
}

export async function generateMetadata(props: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("homeTitle"), description: t("homeDescription") };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Flagship />
      <ProjectsOverview />
      <SectionDivider />
      <AboutTeaser />
      <LatestNews />
      <PeopleTeaser />
      <PartnersStrip />
      <SectionDivider />
      <ClosingCta />
    </>
  );
}
