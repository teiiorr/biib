import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { ProjectTile } from "./ProjectTile";
import { otherProjects } from "@/content";

/** Üç loyiha teng törda: sarlavhalar ham, faktlar ham bir çiziqda. */
export function ProjectsOverview() {
  const t = useTranslations("home.projects");
  const projects = otherProjects();

  return (
    <section className="section-y" aria-labelledby="home-projects">
      <div className="page-w page-x">
        <SectionHead
          id="home-projects"
          heading={t("heading")}
          lead={t("lead")}
          link={{ href: "/projects", label: t("all") }}
        />

        <ul className="row-even mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.id}>
              <Reveal pop delay={index * 110} className="block h-full">
                <ProjectTile project={project} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
