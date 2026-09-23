import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { GirihStar } from "@/components/ornament/GirihStar";
import { OrnamentCover } from "@/components/ornament/OrnamentCover";
import { Ravoq } from "@/components/ornament/Ravoq";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Prose } from "@/components/ui/Prose";
import { Sticker } from "@/components/ui/Sticker";
import { Text } from "@/components/ui/Text";
import { getProjects, t } from "@/content";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

import { InViewVideo } from "./InViewVideo";
import { ProjectsLocalNav } from "./ProjectsLocalNav";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

function factValue(
  project: Project,
  key: "format" | "place" | "schedule" | "teacher",
  locale: Locale,
  pending: string,
): string {
  const fact = project[key];
  return fact.value ? t(fact.value, locale) : pending;
}

/** Loyihalar: chor-bogʻ indeksi, keyin har loyiha oʻz rang hikoyasida toʻliq boʻlim (15.4). */
export function ProjectsPage({ locale, dict }: PageProps) {
  const projects = getProjects();
  const p = dict.projects;
  const navItems = projects.map((project) => ({ id: project.key, label: t(project.name, locale) }));

  return (
    <>
      <PageHero
        title={p.title}
        lead={p.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "projects"), label: dict.nav.projects, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <ProjectsLocalNav items={navItems} label={p.localNav} />
      <Section padded={false} className="pb-12" labelledBy="projects-index">
        <Container>
          <h2 className="sr-only" id="projects-index">
            {p.index}
          </h2>
          <ol className="projects-index" data-card-group="">
            {projects.map((project) => (
              <li key={project.key} data-card="">
                <a
                  href={`#${project.key}`}
                  className="projects-index-link paper-look"
                  data-story={project.story.primary}
                >
                  <span className="t-h4" data-card-title="">
                    {t(project.name, locale)}
                  </span>
                  <span className="t-small text-ink-2">{t(project.tagline, locale)}</span>
                </a>
              </li>
            ))}
            <span className="chorbogh-star birlashma:hidden" aria-hidden="true">
              <GirihStar symmetry={10} size={72} ring />
            </span>
          </ol>
        </Container>
      </Section>
      {projects.map((project, index) => {
        const name = t(project.name, locale);
        const facts: ReadonlyArray<readonly [string, string]> = [
          [
            p.facts.age,
            fill(dict.common.age.range, { from: project.age.from, to: project.age.to }),
          ],
          [p.facts.format, factValue(project, "format", locale, p.facts.pending)],
          [p.facts.place, factValue(project, "place", locale, p.facts.pending)],
          [p.facts.schedule, factValue(project, "schedule", locale, p.facts.pending)],
          [
            p.facts.cost,
            project.cost.free === true
              ? p.facts.free
              : project.cost.free === false
                ? p.facts.pending
                : p.facts.pending,
          ],
          [p.facts.teacher, factValue(project, "teacher", locale, p.facts.pending)],
        ];
        return (
          <Section
            key={project.key}
            id={project.key}
            labelledBy={`${project.key}-title`}
            tone={index % 2 ? "dark" : "light"}
            className="project-section"
            as="article"
          >
            <Container grid className="project-grid">
              <div
                className="col-span-4 md:col-span-8 lg:col-span-5 project-media-col"
                data-grid-item=""
              >
                <DesignArt slot="project-media" locale={locale} story={project.story}>
                  <Ravoq ratio="4:5" className="project-ravoq">
                    {project.media &&
                    project.media.status !== "pending" &&
                    project.media.kind === "video" &&
                    project.media.poster ? (
                      <InViewVideo
                        src={project.media.src}
                        poster={project.media.poster}
                        alt={t(project.media.alt, locale)}
                        pauseLabel={dict.common.actions.pause}
                        playLabel={dict.common.actions.play}
                      />
                    ) : (
                      <OrnamentCover
                        story={project.story}
                        ratio="4:5"
                        seed={`${project.key}-page`}
                      />
                    )}
                  </Ravoq>
                </DesignArt>
                {!project.media || project.media.status === "pending" ? (
                  <Text as="p" size="small" tone="ink-3" className="pt-2">
                    {p.mediaPending}
                  </Text>
                ) : null}
              </div>
              <div
                className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 project-text"
                data-grid-item=""
              >
                <div className="project-head">
                  <Sticker
                    shape="star"
                    paint={project.story.secondary}
                    rotate={index % 2 ? -2 : 2}
                    className="project-sticker"
                  >
                    {fill(p.ageSticker, { from: project.age.from, to: project.age.to })}
                  </Sticker>
                  <Heading level={2} size="h2" id={`${project.key}-title`}>
                    {name}
                  </Heading>
                  <Text as="p" size="body-l" tone="ink-2">
                    {t(project.tagline, locale)}
                  </Text>
                </div>
                <Prose>
                  {t(project.body, locale).map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </Prose>
                <dl className="project-facts" data-audit="gap">
                  <div className="sr-only">{p.facts.heading}</div>
                  {facts.map(([label, value]) => (
                    <div key={label} className="project-fact">
                      <dt className="t-micro text-ink-3">{label}</dt>
                      <dd className="t-body tnum">{value}</dd>
                    </div>
                  ))}
                </dl>
                {project.external ? (
                  <div className="project-cta">
                    <Text as="p" size="small" tone="ink-2" measure>
                      {p.upopNote}
                    </Text>
                    <LinkButton
                      href={project.external.href}
                      variant="primary"
                      size="56"
                      external
                      externalHint={dict.common.hints.external}
                    >
                      {p.openExternal}
                    </LinkButton>
                  </div>
                ) : null}
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
