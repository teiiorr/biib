import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getNews, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { NewsCover } from "./NewsCover";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Yangiliklar: bosh xabar butun kenglikda (kompyuterda muqova 1–7, matn 8–12), qolgan toʻrttasi bir
 * qatorda (planshetda 2 × 2). Muqovalar bir nisbatda, sarlavhalar bir chiziqda boshlanadi; teshik
 * qolmaydi. Beshta xabarga filtr va sahifalash kerak emas. Harakat: bosh muqova yumshoq ochiladi va
 * parallaksda yuradi, qolgan muqovalar abr pogʻonalarida doira ritmida ochiladi (matn joyida).
 */
export function NewsListPage({ locale, dict }: PageProps) {
  const [lead, ...rest] = getNews();
  const n = dict.news;
  return (
    <>
      <PageHero
        title={n.title}
        lead={n.lead}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "news"), label: dict.nav.news, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          {!lead ? (
            <Text as="p" tone="ink-3">
              {n.empty}
            </Text>
          ) : (
            <div className="news-grid" data-card-group="">
              <article className="news-grid-lead" data-card="">
                <TransitionLink
                  href={pathFor(locale, "newsItem", lead.slug)}
                  className="news-cover-link"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <ViewTransition name={sharedName("news-cover", lead.slug)}>
                    <NewsCover
                      article={lead}
                      ratio="3:2"
                      locale={locale}
                      sizes="(min-width: 1440px) 752px, (min-width: 1024px) 55vw, 100vw"
                      priority
                      motion={{ mode: "smooth", parallax: true }}
                    />
                  </ViewTransition>
                </TransitionLink>
                <div className="news-grid-lead-text">
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
                </div>
              </article>
              {rest.map((item, index) => (
                <article key={item.slug} className="news-grid-item" data-card="">
                  <TransitionLink
                    href={pathFor(locale, "newsItem", item.slug)}
                    className="news-cover-link"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <ViewTransition name={sharedName("news-cover", item.slug)}>
                      <NewsCover
                        article={item}
                        ratio="3:2"
                        locale={locale}
                        sizes="(min-width: 1440px) 304px, (min-width: 1024px) 22vw, (min-width: 600px) 45vw, 100vw"
                        motion={{ mode: "abr", index }}
                      />
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
