import { ViewTransition } from "react";
import { preload } from "react-dom";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { Prose } from "@/components/ui/Prose";
import { Text } from "@/components/ui/Text";
import { getFlagship, t } from "@/content";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { ClickToPlayVideoLeaf, InViewVideoLeaf } from "../lazy-leaves";

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

/**
 * UPOP TREND sahifasi: sarlavha va logotip, toʻliq kenglikdagi sahna halqasi, matn va faktlar,
 * bosilganda yuklanadigan film, roʻyxatdan oʻtish lentasi (upop.uz). Harakat: halqa yumshoq ochiladi
 * va parallaksda yuradi (boʻlimning bosh mediasi), sarlavhalar soʻzma-soʻz, matn va faktlar doira
 * ritmida; film ramkasi yumshoq ochiladi.
 */
export function ProjectsPage({ locale, dict }: PageProps) {
  const project = getFlagship();
  const p = dict.projects;
  const { loop, film, wordmark } = project.media;
  /* Halqa kadri ikkala oʻlchamda LCP: poster HTML bilan birga yuqori ustuvorlikda soʻraladi. */
  preload(loop.poster, { as: "image", fetchPriority: "high" });
  const facts: ReadonlyArray<readonly [string, string]> = [
    [p.facts.age, fill(dict.common.age.range, { from: project.age.from, to: project.age.to })],
    [p.facts.format, factValue(project, "format", locale, p.facts.pending)],
    [p.facts.place, factValue(project, "place", locale, p.facts.pending)],
    [p.facts.schedule, factValue(project, "schedule", locale, p.facts.pending)],
    [p.facts.cost, project.cost.free === true ? p.facts.free : p.facts.pending],
    [p.facts.teacher, factValue(project, "teacher", locale, p.facts.pending)],
  ];

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
        className="upop-hero"
      >
        <div className="upop-hero-art" data-upop-wordmark="">
          <ViewTransition name={sharedName("project-media", project.key)}>
            <Picture
              src={wordmark.src}
              alt={t(wordmark.alt, locale)}
              width={wordmark.width}
              height={wordmark.height}
              sizes="(min-width: 1024px) 25vw, 60vw"
              className="upop-wordmark"
            />
          </ViewTransition>
        </div>
      </PageHero>

      <Section as="div" rhythm="none" className="upop-stage">
        <Container>
          <MediaFrame ratio="16:9" hairline motion={{ mode: "smooth", parallax: true }}>
            <InViewVideoLeaf
              sources={loop.desktop}
              mobileSources={loop.mobile}
              poster={loop.poster}
              priority
              alt={t(loop.alt, locale)}
              pauseLabel={dict.common.actions.pause}
              playLabel={dict.common.actions.play}
            />
          </MediaFrame>
        </Container>
      </Section>

      <Section labelledBy="upop-about-title">
        <Container grid className="upop-about">
          <SplitLines
            as="h2"
            className="t-h2 text-balance text-ink upop-about-title"
            id="upop-about-title"
          >
            {p.facts.heading}
          </SplitLines>
          <Reveal className="upop-about-body" attrs={{ "data-grid-item": "" }}>
            <Prose size="body-l">
              {t(project.body, locale).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </Prose>
          </Reveal>
          <Reveal
            as="dl"
            className="upop-facts"
            stagger
            distance={16}
            attrs={{ "data-grid-item": "" }}
          >
            {facts.map(([label, value]) => (
              <div key={label} className="upop-fact">
                <dt className="t-micro text-ink-3">{label}</dt>
                <dd className="t-body tnum">{value}</dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="upop-film-title">
        <Container grid className="upop-film">
          <div className="upop-film-text" data-grid-item="">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="upop-film-title">
              {p.filmHeading}
            </SplitLines>
            <Text as="p" size="body-l" tone="ink-2">
              {p.filmLead}
            </Text>
          </div>
          <div className="upop-film-media" data-grid-item="">
            <MediaFrame ratio="16:9" motion={{ mode: "smooth" }}>
              <ClickToPlayVideoLeaf
                src={film.src}
                poster={film.poster}
                duration={film.duration}
                title={t(film.alt, locale)}
                playLabel={p.playFilm}
              />
            </MediaFrame>
          </div>
        </Container>
      </Section>

      <Section
        tone="dark"
        rhythm="band"
        labelledBy="upop-register-title"
        className="upop-register upop-field"
      >
        <Container grid className="upop-register-grid">
          <div className="upop-register-text" data-grid-item="">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="upop-register-title">
              {p.registrationHeading}
            </SplitLines>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {p.upopNote}
            </Text>
          </div>
          <div className="upop-register-actions" data-grid-item="">
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
        </Container>
      </Section>
    </>
  );
}
