import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectFeature } from "@/components/sections/ProjectFeature";
import { PROJECTS } from "@/content";

export async function generateMetadata(props: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("projects.title"), description: t("meta.projectsDescription") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      {PROJECTS.map((project, index) => (
        <ProjectFeature key={project.id} project={project} index={index} first={index === 0} />
      ))}
    </>
  );
}
