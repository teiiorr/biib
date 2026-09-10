import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { NewsCard } from "@/components/sections/NewsCard";
import { latestNews } from "@/content";

/** Üç sönggi yangilik, ketma-ket çiqadi. */
export function LatestNews() {
  const t = useTranslations("home.news");
  const items = latestNews(3);

  if (items.length === 0) return null;

  return (
    <section className="section-y" aria-labelledby="home-news">
      <div className="page-w page-x">
        <SectionHead
          id="home-news"
          heading={t("heading")}
          link={{ href: "/news", label: t("all") }}
        />

        <ul className="row-even mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.slug} className="flex">
              <Reveal pop delay={index * 110} className="flex w-full">
                <NewsCard item={item} className="w-full" />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
