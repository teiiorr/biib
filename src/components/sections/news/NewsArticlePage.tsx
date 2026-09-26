import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
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

/**
 * Maqola: markazdagi bosh qism (nonushoq, h1, mavzu, sana va oʻqish vaqti), umumiy muqova, markazdagi
 * 65ch matn ustuni, iqtibos, ulashish, oddiy oʻqish chizigʻi, oldingi/keyingi. Matn ustuni va maqola
 * oxiri bir kenglikda, bir oʻqda. Muqova roʻyxatdan umumiy element boʻlib keladi, faqat parallaks.
 */
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
      <Section as="article" rhythm="hero" labelledBy="article-title" className="article">
        <Container grid>
          <header
            className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 article-head"
            data-grid-item=""
          >
            <Breadcrumbs
              items={crumbs}
              label={dict.common.hints.breadcrumbs}
              collapseCurrent
              align="center"
            />
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
                motion={{ mode: "none", parallax: true }}
              />
            </ViewTransition>
          </div>
          <div
            className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4 article-body"
            data-grid-item=""
            id="article-body"
          >
            <Text as="p" size="body-l" tone="ink-2" measure className="article-lead">
              {t(article.lead, locale)}
            </Text>
            {/* Har xatboshi oʻzi koʻtariladi (16 px): oʻqish ritmi buzilmaydi, ekrandagilar joyida. */}
            <Prose size="body-l">
              {body.map((para) => (
                <Reveal as="p" key={para.slice(0, 24)} distance={16}>
                  {para}
                </Reveal>
              ))}
            </Prose>
            {quote ? (
              <Reveal>
                <PullQuote>{quote}</PullQuote>
              </Reveal>
            ) : null}
            <Divider />
            <ShareButtons url={absoluteUrl(path)} title={title} dict={dict.common.actions} />
          </div>
          <ReadingProgress dict={dict.common.reading} targetId="article-body" />
        </Container>
      </Section>
      <Section as="div" rhythm="none" className="article-end">
        <Container grid>
          {/* Oldingi/keyingi maqola matni bilan bir ustunlarda: chiziqlar bir chetda tugaydi. */}
          <div
            className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4"
            data-grid-item=""
          >
            <nav className="article-nav" aria-label={n.title}>
              {/* Halqa: ikkala katak doim toʻla (content/index.ts). */}
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
            <div className="article-back">
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
          </div>
        </Container>
      </Section>
    </>
  );
}
