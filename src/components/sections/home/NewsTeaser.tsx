import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { OrnamentCover } from "@/components/ornament/OrnamentCover";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { getNews, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

interface NewsTeaserProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Yangiliklar: bitta bosh xabar (3:2) va yonida ikkita ustma-ust; telefonda bosh, keyin 1:1 qatorlar. */
export function NewsTeaser({ locale, dict }: NewsTeaserProps) {
  const [lead, ...rest] = getNews();
  const side = rest.slice(0, 2);
  if (!lead) return null;
  const h = dict.home.news;
  return (
    <Section labelledBy="home-news" tone="light">
      <Container>
        <div className="section-head section-head-row">
          <div>
            <Heading level={2} size="h2" id="home-news">
              {h.heading}
            </Heading>
            <Text as="p" size="body-l" tone="ink-2" measure>
              {h.lead}
            </Text>
          </div>
          <LinkButton
            href={pathFor(locale, "news")}
            variant="ghost"
            size="40"
            icon="arrow-right"
            iconPosition="end"
          >
            {h.all}
          </LinkButton>
        </div>
        <div className="news-teaser" data-card-group="">
          <article className="news-lead paper-look" data-card="">
            <TransitionLink
              href={pathFor(locale, "newsItem", lead.slug)}
              className="news-cover-link"
            >
              <ViewTransition name={sharedName("news-cover", lead.slug)}>
                <div className="news-cover" data-ratio="3:2">
                  <OrnamentCover story={lead.story} ratio="3:2" seed={lead.slug} />
                </div>
              </ViewTransition>
            </TransitionLink>
            <p className="t-micro text-ink-3 tnum news-meta">
              {lead.status === "confirmed" ? formatDate(locale, lead.date) : t(lead.topic, locale)}
            </p>
            <Heading level={3} size="h2" className="news-title" data-card-title="">
              <TransitionLink href={pathFor(locale, "newsItem", lead.slug)}>
                {t(lead.title, locale)}
              </TransitionLink>
            </Heading>
            <Text as="p" tone="ink-2" className="news-lead-text" data-clamp="">
              {t(lead.lead, locale)}
            </Text>
          </article>
          <div className="news-side">
            {side.map((item) => (
              <article key={item.slug} className="news-row paper-look" data-card="">
                <TransitionLink
                  href={pathFor(locale, "newsItem", item.slug)}
                  className="news-cover-link news-thumb"
                >
                  <ViewTransition name={sharedName("news-cover", item.slug)}>
                    <div className="news-cover" data-ratio="1:1">
                      <OrnamentCover story={item.story} ratio="1:1" seed={item.slug} />
                    </div>
                  </ViewTransition>
                </TransitionLink>
                <div className="news-row-text">
                  <p className="t-micro text-ink-3 tnum news-meta">
                    {item.status === "confirmed"
                      ? formatDate(locale, item.date)
                      : t(item.topic, locale)}
                  </p>
                  <Heading level={3} size="h4" className="news-title" data-card-title="">
                    <TransitionLink href={pathFor(locale, "newsItem", item.slug)}>
                      {t(item.title, locale)}
                    </TransitionLink>
                  </Heading>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
