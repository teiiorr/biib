import Image from "next/image";
import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { Section } from "@/components/layout/Section";
import { SplitLines } from "@/components/motion/SplitLines";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Text } from "@/components/ui/Text";
import { getFlagship, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { InViewVideo } from "../projects/InViewVideo";

interface UpopFeatureProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * UPOP TREND: bosh loyiha boʻlimi. Lojuvard maydonda logotip (1–5 ustun), sahna halqasi 16:9
 * (6–12), ostida sarlavha, kirish, uchta dalil va ikki harakat. Telefonda: logotip, video, matn.
 * Maydon lenta: ichki boʻshliq --band-pad, missiya lojuvardidan choksiz davom etadi. Sarlavha
 * split-lines bilan (katalog: ekrandan pastdagi h2). Birlashmada halqa afishada.
 */
export function UpopFeature({ locale, dict }: UpopFeatureProps) {
  const project = getFlagship();
  const u = dict.home.upop;
  const { loop, wordmark } = project.media;
  const age = fill(dict.projects.ageSticker, { from: project.age.from, to: project.age.to });

  return (
    <Section labelledBy="home-upop" tone="dark" rhythm="band" className="upop-feature upop-field">
      <Container grid className="upop-feature-grid">
        <div className="upop-feature-wordmark" data-grid-item="" data-upop-wordmark="">
          <ViewTransition name={sharedName("project-media", project.key)}>
            <Image
              src={wordmark.src}
              alt={t(wordmark.alt, locale)}
              width={wordmark.width}
              height={wordmark.height}
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="upop-wordmark"
            />
          </ViewTransition>
        </div>
        <div className="upop-feature-media" data-grid-item="" data-upop-media="">
          <DesignArt
            slot="project-media"
            variant="poster"
            locale={locale}
            story={project.story}
            copy={{ ageSticker: age }}
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
        </div>
        <div className="upop-feature-text" data-grid-item="" data-upop-text="">
          <div className="upop-feature-copy">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="home-upop">
              {u.heading}
            </SplitLines>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {u.lead}
            </Text>
          </div>
          <ul className="upop-feature-list t-body text-ink">
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
    </Section>
  );
}
