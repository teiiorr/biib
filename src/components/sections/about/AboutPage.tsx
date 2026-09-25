import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { Prose } from "@/components/ui/Prose";
import { PullQuote } from "@/components/ui/PullQuote";
import { Text } from "@/components/ui/Text";
import { getMilestones, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

import { HistoryTimeline } from "./HistoryTimeline";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Biz haqimizda (15.3): sarlavha, ikki ustunli matn va bitta iqtibos, keng UPOP TREND kadri, yoʻnalishlar
 * roʻyxati — matnli boʻlimlarda sarlavha 1–4 ustunda (kompyuterda yopishqoq), matn 6–12; tarix chizigʻi
 * sirt lentasida; oxirida UPOP TREND lentasi. Bezak qatlamlari yoʻq. Harakat: sarlavhalar
 * soʻzma-soʻz, matn va qadriyatlar doira ritmida koʻtariladi, tarix nuqtalari ketma-ket.
 */
export function AboutPage({ locale, dict }: PageProps) {
  const a = dict.about;
  const milestones = getMilestones().map((m) => ({
    id: m.id,
    year: m.year,
    title: t(m.title, locale),
    text: t(m.text, locale),
    status: m.status,
  }));
  return (
    <>
      <PageHero
        title={a.title}
        lead={a.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "about"), label: dict.nav.about, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section labelledBy="about-mission">
        <Container grid className="about-split">
          <div className="about-split-head" data-grid-item="">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="about-mission">
              {a.mission.heading}
            </SplitLines>
          </div>
          <Reveal className="about-split-body about-mission" attrs={{ "data-grid-item": "" }}>
            <Prose size="body-l">
              {a.mission.paragraphs.slice(0, 2).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </Prose>
            <PullQuote attribution={a.mission.quoteSource}>{a.mission.quote}</PullQuote>
            <Prose size="body-l">
              {a.mission.paragraphs.slice(2).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </Prose>
          </Reveal>
        </Container>
      </Section>
      {/* Egasining UPOP TREND tasviri: matnli sahifaga bitta keng kadr — maqsaddan yoʻnalishlarga oʻtish. */}
      <Section as="div" rhythm="section" className="about-media">
        <Container>
          <figure className="about-media-figure">
            <MediaFrame ratio="16:9" hairline motion={{ mode: "smooth", parallax: true }}>
              <Picture
                src="/brand/upop-scene.jpg"
                alt={a.media.alt}
                fill
                sizes="(min-width: 1440px) 1312px, (min-width: 1024px) calc(100vw - 96px), calc(100vw - 32px)"
              />
            </MediaFrame>
            <figcaption className="t-small text-ink-3">{a.media.caption}</figcaption>
          </figure>
        </Container>
      </Section>
      <Section labelledBy="about-values" tone="light">
        <Container grid className="about-split">
          <div className="about-split-head" data-grid-item="">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="about-values">
              {a.values.heading}
            </SplitLines>
          </div>
          <Reveal
            as="ul"
            className="about-split-body about-values"
            stagger
            attrs={{ "data-grid-item": "", "data-audit": "gap" }}
          >
            {a.values.items.map((item) => (
              <li key={item.title} className="about-value">
                <Heading level={3} size="h4">
                  {item.title}
                </Heading>
                <Text as="p" tone="ink-2">
                  {item.text}
                </Text>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
      <Section
        labelledBy="about-history"
        tone="dark"
        toneAtlas="light"
        rhythm="band"
        className="about-history"
      >
        <Container>
          <div className="section-head">
            <SplitLines as="h2" className="t-h2 text-balance text-ink" id="about-history">
              {a.history.heading}
            </SplitLines>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {a.history.lead}
            </Text>
          </div>
          <div className="about-timeline-wrap">
            <DesignArt slot="about-timeline" locale={locale} className="about-timeline-art" />
            <HistoryTimeline items={milestones} label={a.history.heading} />
          </div>
          {/* Taʼsis hujjatlari kelguncha alohida boʻlim ochilmaydi: bitta izoh tarix ostida. */}
          <Text as="p" size="small" tone="ink-3" className="about-docs-note">
            {a.documents.pending}
          </Text>
        </Container>
      </Section>
      {/* Atlasda lojuvard UPOP lentasi; Birlashmada qogʻoz — tarix doskasi bilan qoʻshilib ketmaydi. */}
      <Section
        labelledBy="about-next"
        tone="light"
        toneAtlas="dark"
        rhythm="band"
        className="about-next upop-field"
      >
        <Container grid className="upop-register-grid">
          <div className="upop-register-text" data-grid-item="">
            <Heading level={2} size="h2" id="about-next">
              {a.next.heading}
            </Heading>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {a.next.text}
            </Text>
          </div>
          <div className="upop-register-actions" data-grid-item="">
            <LinkButton
              href={pathFor(locale, "projects")}
              variant="primary"
              size="56"
              icon="arrow-right"
              iconPosition="end"
            >
              {a.next.cta}
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
