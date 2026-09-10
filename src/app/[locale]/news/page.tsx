import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/brand/Reveal";
import { NewsCard } from "@/components/sections/NewsCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { allNews } from "@/content";

export async function generateMetadata(props: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("news.title"), description: t("meta.newsDescription") };
}

export default async function NewsPage({ params }: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "news" });
  const items = allNews();

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} accent="sun" />

      <section className="section-y pt-10">
        <div className="page-w page-x">
          {items.length === 0 ? (
            <p className="text-[1.06rem] text-ink-2">{t("empty")}</p>
          ) : (
            <ul className="row-even grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <li key={item.slug} className="flex">
                  <Reveal pop delay={(index % 3) * 100} className="flex w-full">
                    <NewsCard item={item} className="w-full" priority={index < 3} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
