import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/home/Hero";
import { Flagship } from "@/components/sections/home/Flagship";
import { ProjectsOverview } from "@/components/sections/home/ProjectsOverview";
import { AboutTeaser } from "@/components/sections/home/AboutTeaser";
import { LatestNews } from "@/components/sections/home/LatestNews";
import { PeopleTeaser } from "@/components/sections/home/PeopleTeaser";
import { PartnersStrip } from "@/components/sections/home/PartnersStrip";
import { ClosingCta } from "@/components/sections/home/ClosingCta";

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
      <AboutTeaser />
      <LatestNews />
      <PeopleTeaser />
      <PartnersStrip />
      <ClosingCta />
    </>
  );
}
