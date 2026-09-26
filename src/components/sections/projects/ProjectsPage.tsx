import { preload } from "react-dom";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { getFlagship, t } from "@/content";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

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
 * UPOP TREND sahifasi: markazdagi sarlavha, toʻliq kenglikdagi sahna halqasi, faktlar teng toʻrda,
 * bosilganda yuklanadigan film, roʻyxatdan oʻtish lentasi (upop.uz). Sarlavhalar ostida tavsif yoʻq,
 * uzun matn oʻrniga faqat faktlar (egasining talabi). Harakat: halqa yumshoq ochiladi va parallaksda
 * yuradi, sarlavhalar soʻzma-soʻz, faktlar doira ritmida; film ramkasi yumshoq ochiladi.
 */
export function ProjectsPage({ locale, dict }: PageProps) {
  const project = getFlagship();
  const p = dict.projects;
  const { loop, film } = project.media;
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
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "projects"), label: dict.nav.projects, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />

      <Section as="div" rhythm="none" className="upop-stage">
        <Container>
          <MediaFrame ratio="16:9" tone="dark" motion={{ mode: "smooth", parallax: true }}>
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

      <Section labelledBy="upop-facts-title">
        <Container>
          <SectionHeader id="upop-facts-title" title={p.facts.heading} split />
          <Reveal as="dl" className="upop-facts" stagger distance={16}>
            {facts.map(([label, value]) => (
              <div key={label} className="upop-fact">
                <dt className="t-micro text-ink-3">{label}</dt>
                <dd className="t-body text-ink tnum">{value}</dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="upop-film-title">
        <Container>
          <SectionHeader id="upop-film-title" title={p.filmHeading} split />
          <div className="grid-site">
            <div className="upop-film-media" data-grid-item="" data-tone="dark">
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
          </div>
        </Container>
      </Section>

      <Section
        tone="dark"
        rhythm="band"
        labelledBy="upop-register-title"
        className="upop-register upop-field"
      >
        <Container>
          <SectionHeader
            id="upop-register-title"
            title={p.registrationHeading}
            split
            actions={
              <LinkButton
                href={project.external.href}
                variant="primary"
                size="56"
                external
                externalHint={dict.common.hints.external}
              >
                {p.openExternal}
              </LinkButton>
            }
          />
        </Container>
      </Section>
    </>
  );
}
