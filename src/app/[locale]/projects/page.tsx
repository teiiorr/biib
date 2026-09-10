import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectFeature, type FeatureVariant } from "@/components/sections/ProjectFeature";
import { PROJECTS } from "@/content";

export async function generateMetadata(props: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("projects.title"), description: t("meta.projectsDescription") };
}

/** Har lavhaga boşqa ritm: birinçisi panel, keyingilari navbat bilan. */
const RHYTHM: readonly FeatureVariant[] = ["panel", "open", "offset", "open"];

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} accent="coral" />

      <div className="pt-8">
        {PROJECTS.map((project, index) => (
          <ProjectFeature
            key={project.id}
            project={project}
            variant={RHYTHM[index % RHYTHM.length] ?? "open"}
            index={index}
          />
        ))}
      </div>
    </>
  );
}
