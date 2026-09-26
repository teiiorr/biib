import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { getNews, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { sharedName } from "@/lib/motion/transitions";

import { NewsCover } from "../news/NewsCover";

interface NewsTeaserProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Yangiliklar: markazdagi sarlavha, bitta bosh xabar (3:2) va yonida qolgan toʻrttasi ustma-ust
 * (1:1 kichik muqova). Kartada faqat sana (yoki mavzu) va nom: parcha matn yoʻq (egasining talabi).
 * Yon ustun bosh xabar balandligiga choʻziladi: ikkala ustun bir chiziqda tugaydi. Telefonda ketma-ket.
 * Harakat: bosh muqova yumshoq ochiladi va parallaksda yuradi, yon qatorlar doira ritmida koʻtariladi.
 */
export function NewsTeaser({ locale, dict }: NewsTeaserProps) {
  const [lead, ...rest] = getNews();
  const side = rest.slice(0, 4);
  if (!lead) return null;
  const h = dict.home.news;
  return (
    <Section labelledBy="home-news" tone="light" className="news-section">
      <Container>
        <SectionHeader id="home-news" title={h.heading} split />
        <div className="news-teaser" data-card-group="">
          <article className="news-lead" data-card="">
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
                  sizes="(min-width: 1440px) 765px, (min-width: 1024px) 58vw, 100vw"
                  motion={{ mode: "smooth", parallax: true }}
                />
              </ViewTransition>
            </TransitionLink>
            <div className="news-lead-text">
              <p className="t-micro text-ink-3 tnum news-meta">
                {lead.status === "confirmed"
                  ? formatDate(locale, lead.date)
                  : t(lead.topic, locale)}
              </p>
              <Heading level={3} size="h3" className="news-title" attrs={{ "data-card-title": "" }}>
                <TransitionLink href={pathFor(locale, "newsItem", lead.slug)}>
                  {t(lead.title, locale)}
                </TransitionLink>
              </Heading>
            </div>
          </article>
          <Reveal as="div" className="news-side" stagger>
            {side.map((item) => (
              <article key={item.slug} className="news-row" data-card="">
                <TransitionLink
                  href={pathFor(locale, "newsItem", item.slug)}
                  className="news-cover-link news-thumb"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <ViewTransition name={sharedName("news-cover", item.slug)}>
                    <NewsCover
                      article={item}
                      ratio="1:1"
                      locale={locale}
                      sizes="(min-width: 1024px) 160px, 96px"
                    />
                  </ViewTransition>
                </TransitionLink>
                <div className="news-row-text">
                  <p className="t-micro text-ink-3 tnum news-meta">
                    {item.status === "confirmed"
                      ? formatDate(locale, item.date)
                      : t(item.topic, locale)}
                  </p>
                  <Heading
                    level={3}
                    size="h4"
                    className="news-title"
                    attrs={{ "data-card-title": "" }}
                  >
                    <TransitionLink href={pathFor(locale, "newsItem", item.slug)}>
                      {t(item.title, locale)}
                    </TransitionLink>
                  </Heading>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
        {/* «Barchasi» havolasi kartalar ostida, oʻng chetda (egasining talabi): avval koʻrasiz, keyin oʻtasiz. */}
        <div className="section-footer">
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
      </Container>
    </Section>
  );
}
