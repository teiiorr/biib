import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { ProjectCard } from "./ProjectCard";
import { flagshipProject } from "@/content";

/**
 * "Loyihalar" bölimi. Endi bitta karta — birlaşmaning bosh loyihasi
 * UPOP TREND, markazda, kengroq ölçamda.
 */
export function ProjectsOverview() {
  const t = useTranslations("home.projects");
  const project = flagshipProject();

  return (
    <section className="section" aria-labelledby="home-projects">
      <div className="page">
        <Reveal>
          <SectionHead id="home-projects" heading={t("heading")} />
        </Reveal>

        <div className="mt-10 flex justify-center">
          <Reveal className="flex w-full max-w-md">
            <ProjectCard project={project} className="w-full" />
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-6">
          <SectionMore links={[{ href: "/projects", label: t("all") }]} />
        </Reveal>
      </div>
    </section>
  );
}
