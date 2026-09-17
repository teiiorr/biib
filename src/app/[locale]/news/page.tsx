import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="section pt-4">
        <div className="page">
          {items.length === 0 ? (
            <p className="text-body text-label-secondary">{t("empty")}</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <li key={item.slug} className="flex">
                  <NewsCard item={item} className="w-full" priority={index < 3} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
