import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { getFlagship, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { InViewVideoLeaf } from "../lazy-leaves";
import { UpopMotion } from "./UpopMotion";

interface UpopFeatureProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * UPOP TREND: bosh loyiha boʻlimi. Lojuvard maydonda tepada markazdagi sarlavha, ostida logotip
 * (1–5 ustun) va sahna halqasi 16:9 (6–12), keyin uchta teng dalil bir qatorda va oʻng chetda ikki
 * harakat. Telefonda hammasi ketma-ket. Maydon missiya lojuvardidan choksiz davom etadi.
 * Harakat (upop-scene) UpopMotion da: kompyuterda kadr butun sahnadan oʻz katagiga qoʻnadi, telefonda
 * ketma-ket ochiladi; DOM yakuniy holat.
 */
export function UpopFeature({ locale, dict }: UpopFeatureProps) {
  const project = getFlagship();
  const u = dict.home.upop;
  const { loop, wordmark } = project.media;

  return (
    <Section labelledBy="home-upop" tone="dark" rhythm="band" className="upop-feature upop-field">
      <div className="upop-feature-stage" data-upop-stage="" data-testid="upop-scene">
        <UpopMotion />
        <Container grid className="upop-feature-grid">
          <SectionHeader id="home-upop" title={u.heading} className="upop-feature-head" />
          <div className="upop-feature-wordmark" data-grid-item="" data-upop-wordmark="">
            <ViewTransition name={sharedName("project-media", project.key)}>
              <Picture
                src={wordmark.src}
                alt={t(wordmark.alt, locale)}
                width={wordmark.width}
                height={wordmark.height}
                sizes="(min-width: 1024px) 34vw, 80vw"
                className="upop-wordmark"
              />
            </ViewTransition>
          </div>
          <div className="upop-feature-media" data-grid-item="" data-upop-media="">
            <MediaFrame ratio="16:9">
              <InViewVideoLeaf
                sources={loop.desktop}
                mobileSources={loop.mobile}
                poster={loop.poster}
                alt={t(loop.alt, locale)}
                pauseLabel={dict.common.actions.pause}
                playLabel={dict.common.actions.play}
              />
            </MediaFrame>
            <span className="upop-feature-dim" data-upop-dim="" aria-hidden="true" />
          </div>
          <div className="upop-feature-text" data-grid-item="" data-upop-text="">
            <ul className="upop-feature-list t-body-l text-ink">
              {t(project.highlights, locale).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="upop-feature-actions">
              <LinkButton
                href={project.external.href}
                variant="primary"
                size="56"
                external
                externalHint={dict.common.hints.external}
              >
                {u.register}
              </LinkButton>
              <Button asChild variant="ghost" size="56" icon="chevron-right" iconPosition="end">
                <TransitionLink href={pathFor(locale, "projects")}>
                  <span className="text-trim">{u.open}</span>
                </TransitionLink>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
