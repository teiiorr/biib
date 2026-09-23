import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { OrnamentCover } from "@/components/ornament/OrnamentCover";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getNews, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/** Yangiliklar: bosh xabar katta, qolgani asimmetrik toʻrda; beshta xabarga filtr va sahifalash kerak emas. */
export function NewsListPage({ locale, dict }: PageProps) {
  const [lead, ...rest] = getNews();
  const n = dict.news;
  return (
    <>
      <PageHero
        title={n.title}
        lead={n.lead}
        art={<DesignArt slot="news-header" locale={locale} className="news-header-art" />}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "news"), label: dict.nav.news, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section padded={false} className="pb-24">
        <Container>
          {!lead ? (
            <Text as="p" tone="ink-3">
              {n.empty}
            </Text>
          ) : (
            <div className="news-grid" data-card-group="">
              <article className="news-grid-lead paper-look" data-card="">
                <TransitionLink
                  href={pathFor(locale, "newsItem", lead.slug)}
                  className="news-cover-link"
                >
                  <ViewTransition name={sharedName("news-cover", lead.slug)}>
                    <div className="news-cover">
                      <OrnamentCover story={lead.story} ratio="3:2" seed={lead.slug} />
                    </div>
                  </ViewTransition>
                </TransitionLink>
                <p className="t-micro text-ink-3 tnum news-meta">
                  {lead.status === "confirmed"
                    ? formatDate(locale, lead.date)
                    : t(lead.topic, locale)}
                </p>
                <Heading level={2} size="h2" className="news-title" data-card-title="">
                  <TransitionLink href={pathFor(locale, "newsItem", lead.slug)}>
                    {t(lead.title, locale)}
                  </TransitionLink>
                </Heading>
                <Text as="p" size="body-l" tone="ink-2" measure>
                  {t(lead.lead, locale)}
                </Text>
              </article>
              {rest.map((item, i) => (
                <article
                  key={item.slug}
                  className={`news-grid-item paper-look ${i % 3 === 0 ? "news-grid-wide" : ""}`}
                  data-card=""
                >
                  <TransitionLink
                    href={pathFor(locale, "newsItem", item.slug)}
                    className="news-cover-link"
                  >
                    <ViewTransition name={sharedName("news-cover", item.slug)}>
                      <div className="news-cover">
                        <OrnamentCover
                          story={item.story}
                          ratio={i % 3 === 0 ? "16:9" : "4:5"}
                          seed={item.slug}
                        />
                      </div>
                    </ViewTransition>
                  </TransitionLink>
                  <p className="t-micro text-ink-3 tnum news-meta">
                    {item.status === "confirmed"
                      ? formatDate(locale, item.date)
                      : t(item.topic, locale)}
                  </p>
                  <Heading level={2} size="h3" className="news-title" data-card-title="">
                    <TransitionLink href={pathFor(locale, "newsItem", item.slug)}>
                      {t(item.title, locale)}
                    </TransitionLink>
                  </Heading>
                  <Text as="p" tone="ink-2" data-clamp="" className="news-lead-text">
                    {t(item.lead, locale)}
                  </Text>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
