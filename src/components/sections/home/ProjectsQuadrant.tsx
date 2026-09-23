import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { GirihStar } from "@/components/ornament/GirihStar";
import { OrnamentCover } from "@/components/ornament/OrnamentCover";
import { Ravoq } from "@/components/ornament/Ravoq";
import { Icon } from "@/components/icons/Icon";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getProjects, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface ProjectsQuadrantProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Chor-bogʻ: 2×2 kvadrant, kesishmada girih yulduzi; har kvadrant ravoq media 4:5, nom, jumla, havola. */
export function ProjectsQuadrant({ locale, dict }: ProjectsQuadrantProps) {
  const projects = getProjects();
  const h = dict.home.projects;
  return (
    <Section labelledBy="home-projects" tone="light">
      <Container>
        <Reveal className="section-head">
          <SplitLines as="h2" className="t-h2" id="home-projects">
            {h.heading}
          </SplitLines>
          <Text as="p" size="body-l" tone="ink-2" measure>
            {h.lead}
          </Text>
        </Reveal>
        <Reveal as="div" className="chorbogh" stagger attrs={{ "data-card-group": "" }}>
          {projects.map((project, i) => {
            const name = t(project.name, locale);
            const href = project.external
              ? project.external.href
              : `${pathFor(locale, "projects")}#${project.key}`;
            return (
              <article
                key={project.key}
                className="chorbogh-cell paper-look"
                data-card=""
                data-story={project.story.primary}
                style={{ "--paper-seed": i } as React.CSSProperties}
              >
                <Ravoq ratio="4:5" className="chorbogh-media">
                  <OrnamentCover story={project.story} ratio="4:5" seed={project.key} />
                </Ravoq>
                <span className="t-micro text-ink-3 tnum chorbogh-age">
                  {fill(dict.common.age.range, { from: project.age.from, to: project.age.to })}
                </span>
                <Heading level={3} size="h3" className="chorbogh-title" data-card-title="">
                  {name}
                </Heading>
                <Text as="p" tone="ink-2" className="chorbogh-text">
                  {t(project.tagline, locale)}
                </Text>
                <div className="chorbogh-cta" data-card-cta="">
                  {project.external ? (
                    <LinkButton
                      href={href}
                      variant="link"
                      size="40"
                      external
                      externalHint={dict.common.hints.external}
                    >
                      {h.external}
                    </LinkButton>
                  ) : (
                    <TransitionLink
                      href={href}
                      className="ui-button t-label chorbogh-link"
                      data-variant="link"
                      data-size="40"
                    >
                      <span className="text-trim">{h.open}</span>
                      <Icon name="chevron-right" size={16} />
                    </TransitionLink>
                  )}
                </div>
              </article>
            );
          })}
          {/* Yulduz kataklardan keyin: DOM tartibi bilan ustida, z-index siz. */}
          <span className="chorbogh-star birlashma:hidden" aria-hidden="true">
            <GirihStar symmetry={10} size={96} ring />
          </span>
        </Reveal>
      </Container>
    </Section>
  );
}
