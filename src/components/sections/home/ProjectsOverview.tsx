import { useTranslations } from "next-intl";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { ProjectCard } from "./ProjectCard";
import { otherProjects } from "@/content";

export function ProjectsOverview() {
  const t = useTranslations("home.projects");
  const projects = otherProjects();

  return (
    <section className="section" aria-labelledby="home-projects">
      <div className="page">
        <SectionHead id="home-projects" heading={t("heading")} lead={t("lead")} />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id} className="flex">
              <ProjectCard project={project} className="w-full" />
            </li>
          ))}
        </ul>

        <SectionMore className="mt-6" links={[{ href: "/projects", label: t("all") }]} />
      </div>
    </section>
  );
}
