import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { ProjectCard } from "./ProjectCard";
import { otherProjects } from "@/content";

export function ProjectsOverview() {
  const t = useTranslations("home.projects");
  const projects = otherProjects();

  return (
    <section className="section" aria-labelledby="home-projects">
      <div className="page">
        <Reveal>
          <SectionHead id="home-projects" heading={t("heading")} lead={t("lead")} />
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.id} delay={index * 90} className="flex">
              <ProjectCard project={project} index={index + 2} className="w-full" />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120} className="mt-6">
          <SectionMore links={[{ href: "/projects", label: t("all") }]} />
        </Reveal>
      </div>
    </section>
  );
}
