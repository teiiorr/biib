import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Prose } from "@/components/ui/Prose";
import { getArticle, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor, type NewsSlug } from "@/i18n/routes";

interface NewsArticlePageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
  readonly slug: NewsSlug;
}

export function NewsArticlePage({ locale, dict, slug }: NewsArticlePageProps) {
  const article = getArticle(slug);
  return (
    <>
      <PageHero
        title={t(article.title, locale)}
        lead={t(article.lead, locale)}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "news"), label: dict.nav.news },
          {
            href: pathFor(locale, "newsItem", slug),
            label: t(article.title, locale),
            current: true,
          },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section as="article">
        <Container>
          <Prose size="body-l">
            {t(article.body, locale).map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>
    </>
  );
}
