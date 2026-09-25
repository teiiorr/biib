import Image from "next/image";
import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ClickToPlayVideo } from "@/components/media/ClickToPlayVideo";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Prose } from "@/components/ui/Prose";
import { Text } from "@/components/ui/Text";
import { getFlagship, t } from "@/content";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { InViewVideo } from "./InViewVideo";

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
 * bosilganda yuklanadigan film, roʻyxatdan oʻtish lentasi (upop.uz). Birlashmada halqa parda ortida.
 */
export function ProjectsPage({ locale, dict }: PageProps) {
  const project = getFlagship();
  const p = dict.projects;
  const { loop, film, wordmark } = project.media;
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
            <Image
              src={wordmark.src}
              alt={t(wordmark.alt, locale)}
              width={wordmark.width}
              height={wordmark.height}
              sizes="(min-width: 1024px) 25vw, 80vw"
              priority
              className="upop-wordmark"
            />
          </ViewTransition>
        </div>
      </PageHero>

      <Section as="div" rhythm="none" className="upop-stage">
        <Container>
          <DesignArt
            slot="project-media"
            variant="curtain"
            locale={locale}
            story={project.story}
            copy={{ curtainLabel: p.curtainLabel }}
            className="upop-stage-art"
          >
            <MediaFrame ratio="16:9" hairline>
              <InViewVideo
                sources={loop.desktop}
                mobileSources={loop.mobile}
                poster={loop.poster}
                alt={t(loop.alt, locale)}
                pauseLabel={dict.common.actions.pause}
                playLabel={dict.common.actions.play}
              />
            </MediaFrame>
          </DesignArt>
        </Container>
      </Section>

      <Section labelledBy="upop-about-title">
        <Container grid className="upop-about">
          <Heading level={2} size="h2" id="upop-about-title" className="upop-about-title">
            {p.facts.heading}
          </Heading>
          <div className="upop-about-body" data-grid-item="">
            <Prose size="body-l">
              {t(project.body, locale).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </Prose>
          </div>
          <dl className="upop-facts" data-grid-item="">
            {facts.map(([label, value]) => (
              <div key={label} className="upop-fact">
                <dt className="t-micro text-ink-3">{label}</dt>
                <dd className="t-body tnum">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section labelledBy="upop-film-title">
        <Container grid className="upop-film">
          <div className="upop-film-text" data-grid-item="">
            <Heading level={2} size="h2" id="upop-film-title">
              {p.filmHeading}
            </Heading>
            <Text as="p" size="body-l" tone="ink-2">
              {p.filmLead}
            </Text>
          </div>
          <div className="upop-film-media" data-grid-item="">
            <MediaFrame ratio="16:9">
              <ClickToPlayVideo
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
            <Heading level={2} size="h2" id="upop-register-title">
              {p.registrationHeading}
            </Heading>
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
