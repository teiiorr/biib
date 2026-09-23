import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { GanchLayers } from "@/components/ornament/GanchLayers";
import { IslimiyBullet } from "@/components/ornament/IslimiyBullet";
import { XivaTimeline } from "@/components/ornament/XivaTimeline";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Prose } from "@/components/ui/Prose";
import { PullQuote } from "@/components/ui/PullQuote";
import { Text } from "@/components/ui/Text";
import { getMilestones, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Biz haqimizda: ganch chuqurlikli sarlavha, ikki ustunli matn va bitta iqtibos, islimiy roʻyxat, Xiva ustunlari (15.3). */
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
        art={
          <div className="about-ganch birlashma:hidden" aria-hidden="true">
            <GanchLayers seed="biz-haqimizda" parallax />
          </div>
        }
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "about"), label: dict.nav.about, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section labelledBy="about-mission">
        <Container grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-4" data-grid-item="">
            <Heading level={2} size="h2" id="about-mission">
              {a.mission.heading}
            </Heading>
          </div>
          <div
            className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6 about-mission"
            data-grid-item=""
          >
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
          </div>
        </Container>
      </Section>
      <Section labelledBy="about-values" tone="light">
        <Container grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-4" data-grid-item="">
            <Heading level={2} size="h2" id="about-values">
              {a.values.heading}
            </Heading>
          </div>
          <ul
            className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6 about-values"
            data-grid-item=""
            data-audit="gap"
          >
            {a.values.items.map((item) => (
              <li key={item.title} className="about-value">
                <IslimiyBullet className="about-bullet" />
                <div>
                  <Heading level={3} size="h4">
                    {item.title}
                  </Heading>
                  <Text as="p" tone="ink-2">
                    {item.text}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section labelledBy="about-history" tone="dark" className="about-history">
        <Container>
          <div className="section-head">
            <Heading level={2} size="h2" id="about-history">
              {a.history.heading}
            </Heading>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {a.history.lead}
            </Text>
          </div>
          <div className="about-timeline-wrap">
            <DesignArt slot="about-timeline" locale={locale} className="about-timeline-art" />
            <XivaTimeline
              items={milestones}
              pendingLabel={a.history.pending}
              label={a.history.heading}
            />
          </div>
        </Container>
      </Section>
      <Section labelledBy="about-docs">
        <Container grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-4" data-grid-item="">
            <Heading level={2} size="h2" id="about-docs">
              {a.documents.heading}
            </Heading>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" data-grid-item="">
            <Text as="p" tone="ink-3" measure>
              {a.documents.pending}
            </Text>
          </div>
        </Container>
      </Section>
      <Section labelledBy="about-next" tone="light">
        <Container className="about-next paper-look">
          <Heading level={2} size="h3" id="about-next">
            {a.next.heading}
          </Heading>
          <Text as="p" tone="ink-2" measure>
            {a.next.text}
          </Text>
          <div>
            <LinkButton
              href={pathFor(locale, "projects")}
              variant="primary"
              size="48"
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
