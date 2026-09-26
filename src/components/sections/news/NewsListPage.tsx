import { ViewTransition } from "react";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { headingClass } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getNews, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { cx } from "@/lib/cx";
import { sharedName } from "@/lib/motion/transitions";

import { NewsCover } from "./NewsCover";

interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Yangiliklar: markazdagi sarlavha; bosh xabar butun kenglikda (kompyuterda muqova 1–8, matn 9–12
 * oʻrtada), qolgan toʻrttasi bir qatorda (planshetda 2 × 2). Kartada faqat
 * sana yoki mavzu va sarlavha: uzun kirish matni yoʻq (egasining talabi). Muqovalar bir nisbatda,
 * sarlavhalar bir chiziqda boshlanadi. Harakat: bosh muqova yumshoq ochiladi va parallaksda yuradi,
 * qolgan muqovalar abr pogʻonalarida doira ritmida ochiladi (matn joyida).
 */
export function NewsListPage({ locale, dict }: PageProps) {
  const [lead, ...rest] = getNews();
  const n = dict.news;
  return (
    <>
      <PageHero
        title={n.title}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "news"), label: dict.nav.news, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section>
        <Container>
          {!lead ? (
            <Text as="p" tone="ink-3" align="center">
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
                      sizes="(min-width: 1440px) 864px, (min-width: 1024px) 62vw, 100vw"
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
                  {/* Karta sarlavhasi oltin emas: oltin faqat sahifa va boʻlim sarlavhalarida. Telefonda
                      h3 oʻlchamida: sahifa sarlavhasi bilan raqobatlashmaydi. */}
                  <h2 className="t-h3 md:t-h2 text-balance text-ink news-title" data-card-title="">
                    <TransitionLink href={pathFor(locale, "newsItem", lead.slug)}>
                      {t(lead.title, locale)}
                    </TransitionLink>
                  </h2>
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
                  <h2
                    className={cx(headingClass(2, "h3", "start"), "news-title")}
                    data-card-title=""
                  >
                    <TransitionLink href={pathFor(locale, "newsItem", item.slug)}>
                      {t(item.title, locale)}
                    </TransitionLink>
                  </h2>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
