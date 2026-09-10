import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Doodle } from "@/components/brand/Doodle";
import { CoverPlaceholder } from "@/components/brand/Placeholder";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { NewsCard } from "@/components/sections/NewsCard";
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

  return {
    title: pick(item.title, locale as Locale),
    description: pick(item.lead, locale as Locale),
    openGraph: {
      type: "article",
      title: pick(item.title, locale as Locale),
      description: pick(item.lead, locale as Locale),
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
      <article className="pt-10 sm:pt-14">
        <div className="page-w page-x">
          <Reveal>
            <Link
              href="/news"
              className="group inline-flex min-h-11 items-center gap-2 rounded-btn px-1 font-display text-[0.96rem] font-bold text-ink-2 transition-colors duration-200 hover:text-blue-deep focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            >
              <Icon
                name="arrow-right"
                className="h-[1.05rem] w-[1.05rem] rotate-180 transition-transform duration-300 ease-[var(--ease-pop)] group-hover:-translate-x-1"
              />
              {tCommon("backToNews")}
            </Link>
          </Reveal>

          <header className="mx-auto mt-6 max-w-[46rem]">
            <Reveal delay={70}>
              <p className="text-[0.96rem] font-semibold text-ink-muted">
                <time dateTime={isoDate(item.date)}>{formatDate(item.date, typed, "long")}</time>
                {" · "}
                {pick(item.topic, typed)}
              </p>
            </Reveal>

            <Reveal delay={130} pop>
              <h1 className="mt-3 text-[clamp(2rem,5vw,3.1rem)]">{pick(item.title, typed)}</h1>
            </Reveal>

            <Reveal delay={210}>
              <p className="mt-5 text-[1.16rem] leading-relaxed text-ink-2">
                {pick(item.lead, typed)}
              </p>
            </Reveal>
          </header>
        </div>

        <div className="page-w page-x mt-9">
          <Reveal delay={160}>
            <div className="relative mx-auto aspect-[16/9] max-w-[58rem] overflow-hidden rounded-card border border-line bg-surface-2 shadow-soft [container-type:inline-size]">
              {item.cover ? (
                <Image
                  src={item.cover}
                  alt={pick(item.coverAlt, typed)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 94vw, 58rem"
                  className="object-cover"
                />
              ) : (
                <CoverPlaceholder accent={item.accent} topic={pick(item.topic, typed)} />
              )}
            </div>
          </Reveal>
        </div>

        <div className="page-w page-x">
          <div className="mx-auto mt-10 flex max-w-[42rem] flex-col gap-5 text-[1.1rem] leading-[1.75] text-ink-2 sm:text-[1.14rem]">
            {pick(item.body, typed).map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 80}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={240}>
            <div className="mx-auto mt-10 flex max-w-[42rem] items-center gap-3 border-t border-line pt-6 text-[0.95rem] text-ink-muted">
              <Doodle name="spark" className="h-4 w-4 shrink-0 text-sun" />
              {t("published")}
              {": "}
              <time dateTime={isoDate(item.date)}>{formatDate(item.date, typed, "long")}</time>
            </div>
          </Reveal>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section-y" aria-labelledby="related-news">
          <div className="page-w page-x">
            <Reveal>
              <h2 id="related-news" className="text-[clamp(1.6rem,3.6vw,2.2rem)]">
                {t("otherNews")}
              </h2>
            </Reveal>

            <ul className="row-even mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other, index) => (
                <li key={other.slug} className="flex">
                  <Reveal pop delay={index * 100} className="flex w-full">
                    <NewsCard item={other} className="w-full" />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
