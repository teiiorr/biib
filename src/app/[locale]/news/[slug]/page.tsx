import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CoverPlaceholder } from "@/components/brand/Placeholder";
import { NewsCard } from "@/components/sections/NewsCard";
import { SectionHead } from "@/components/sections/SectionHead";
import { Link } from "@/i18n/navigation";
import { NEWS, findNews, pick, relatedNews } from "@/content";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/locales";
import { formatDate, isoDate } from "@/lib/format";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => NEWS.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const item = findNews(slug);
  if (!item) return {};

  const typed = locale as Locale;
  return {
    title: pick(item.title, typed),
    description: pick(item.lead, typed),
    openGraph: {
      type: "article",
      title: pick(item.title, typed),
      description: pick(item.lead, typed),
      publishedTime: isoDate(item.date),
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = findNews(slug);
  if (!item) notFound();

  const typed = locale as Locale;
  const t = await getTranslations({ locale, namespace: "news" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const related = relatedNews(slug, 3);

  return (
    <>
      <article>
        <div className="page pt-8">
          <Link
            href="/news"
            className="tap inline-flex min-h-10 items-center rounded-sm text-callout font-semibold text-accent-text transition-colors duration-[var(--dur-fast)] hover:text-accent"
          >
            {tCommon("backToNews")}
          </Link>
        </div>

        <header className="page read pt-4">
          <p className="flex flex-wrap items-baseline gap-x-3 text-footnote">
            <span className="font-medium text-label">{pick(item.topic, typed)}</span>
            <time dateTime={isoDate(item.date)} className="text-label-secondary">
              {formatDate(item.date, typed, "long")}
            </time>
          </p>

          <h1 className="mt-3 text-title1 md:text-display">{pick(item.title, typed)}</h1>
          <p className="mt-4 text-headline text-label-secondary">{pick(item.lead, typed)}</p>
        </header>

        <div className="page mt-8">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-lg bg-sunken shadow-[inset_0_0_0_0.5px_var(--separator)]">
            {item.cover ? (
              <Image
                src={item.cover}
                alt={pick(item.coverAlt, typed)}
                fill
                priority
                sizes="(max-width: 1024px) 94vw, 56rem"
                className="object-cover"
              />
            ) : (
              <CoverPlaceholder topic={pick(item.topic, typed)} />
            )}
          </div>
        </div>

        <div className="page read mt-8 flex flex-col gap-4 text-body text-label-secondary">
          {pick(item.body, typed).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="page read mt-8 border-t border-separator pt-5 text-footnote text-label-secondary">
          {t("published")}: <time dateTime={isoDate(item.date)}>{formatDate(item.date, typed, "long")}</time>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="related-news">
          <div className="page">
            <SectionHead id="related-news" heading={t("otherNews")} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug} className="flex">
                  <NewsCard item={other} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
