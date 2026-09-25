import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { PullQuote } from "@/components/ui/PullQuote";
import { Tag } from "@/components/ui/Tag";
import { Text } from "@/components/ui/Text";
import { getArticle, getArticleNeighbours, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatDate, readingMinutes } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor, type NewsSlug } from "@/i18n/routes";
import { NAV_BACK, sharedName } from "@/lib/motion/transitions";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/site";

import { NewsCover } from "./NewsCover";
import { ReadingProgress } from "./ReadingProgress";
import { ShareButtons } from "./ShareButtons";

interface NewsArticlePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly slug: NewsSlug;
}

/** Maqola: nonushoq, h1, sana va oʻqish vaqti, umumiy muqova, 65ch matn, iqtibos, ulashish, qalampir, oldingi/keyingi. */
export function NewsArticlePage({ locale, dict, slug }: NewsArticlePageProps) {
  const article = getArticle(slug);
  const { previous, next } = getArticleNeighbours(slug);
  const path = pathFor(locale, "newsItem", slug);
  const title = t(article.title, locale);
  const body = t(article.body, locale);
  const minutes = readingMinutes(body);
  const n = dict.news;
  const quote = article.quote ? t(article.quote, locale) : null;
  const crumbs = [
    { href: pathFor(locale, "home"), label: dict.nav.home },
    { href: pathFor(locale, "news"), label: dict.nav.news },
    { href: path, label: title, current: true },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, path: c.href }))),
          ...(newsArticleJsonLd({ article, locale, dict, path })
            ? [newsArticleJsonLd({ article, locale, dict, path }) as Record<string, unknown>]
            : []),
        ]}
      />
      <Section as="article" labelledBy="article-title" className="article">
        <Container grid>
          <header
            className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 article-head"
            data-grid-item=""
          >
            <Breadcrumbs items={crumbs} label={dict.common.hints.breadcrumbs} />
            <Heading level={1} size="h1" id="article-title">
              {title}
            </Heading>
            <p className="t-small text-ink-3 tnum article-meta">
              <Tag tone={article.story.primary}>{t(article.topic, locale)}</Tag>
              {article.status === "confirmed" ? (
                <span>{formatDate(locale, article.date)}</span>
              ) : null}
              <span>{fill(dict.common.time.readingTime, { minutes })}</span>
            </p>
            {article.status !== "confirmed" ? (
              <Text as="p" size="small" tone="ink-3">
                {n.draftNote}
              </Text>
            ) : null}
          </header>
          <div
            className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2 article-cover"
            data-grid-item=""
          >
            <ViewTransition name={sharedName("news-cover", slug)}>
              <NewsCover
                article={article}
                ratio="16:9"
                locale={locale}
                sizes="(min-width: 1440px) 1090px, (min-width: 1024px) 83vw, 100vw"
                meaningful
                priority
              />
            </ViewTransition>
          </div>
          <div
            className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3 article-body"
            data-grid-item=""
            id="article-body"
          >
            <Text as="p" size="body-l" tone="ink-2" measure className="article-lead">
              {t(article.lead, locale)}
            </Text>
            <Prose size="body-l">
              {body.map((para, i) => (
                <p key={para.slice(0, 24)}>
                  {para}
                  {quote && i === 0 ? null : null}
                </p>
              ))}
            </Prose>
            {quote ? <PullQuote>{quote}</PullQuote> : null}
            <Divider />
            <ShareButtons url={absoluteUrl(path)} title={title} dict={dict.common.actions} />
          </div>
          <aside
            className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-11 article-aside"
            data-grid-item=""
          >
            <ReadingProgress locale={locale} dict={dict.ornament} targetId="article-body" />
          </aside>
        </Container>
      </Section>
      <Section padded={false} className="pb-24" as="div">
        <Container>
          <nav className="article-nav" aria-label={n.title}>
            {previous ? (
              <TransitionLink
                href={pathFor(locale, "newsItem", previous.slug)}
                direction={NAV_BACK}
                className="article-nav-link"
              >
                <span className="t-micro text-ink-3">{n.previous}</span>
                <span className="t-label">{t(previous.title, locale)}</span>
              </TransitionLink>
            ) : (
              <span />
            )}
            {next ? (
              <TransitionLink
                href={pathFor(locale, "newsItem", next.slug)}
                className="article-nav-link article-nav-next"
              >
                <span className="t-micro text-ink-3">{n.next}</span>
                <span className="t-label">{t(next.title, locale)}</span>
              </TransitionLink>
            ) : (
              <span />
            )}
          </nav>
          <div className="pt-8">
            <TransitionLink
              href={pathFor(locale, "news")}
              direction={NAV_BACK}
              className={buttonVariants({ variant: "link", size: "40" })}
              data-variant="link"
              data-size="40"
            >
              <span className="text-trim">{n.backToList}</span>
            </TransitionLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
