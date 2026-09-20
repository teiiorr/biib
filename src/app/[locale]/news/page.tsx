import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/brand/Reveal";
import { NewsCard } from "@/components/sections/NewsCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { allNews } from "@/content";
import { cn } from "@/lib/cn";

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
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:auto-rows-[minmax(0,1fr)]">
              {items.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.slug}
                  delay={(index % 3) * 90}
                  index={index % 3}
                  className={cn("flex", index === 0 && "sm:col-span-2 lg:row-span-2")}
                >
                  <NewsCard
                    item={item}
                    featured={index === 0}
                    className="w-full"
                    priority={index < 3}
                  />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
