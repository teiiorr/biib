import { useTranslations } from "next-intl";
import { NewsCard } from "@/components/sections/NewsCard";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { latestNews } from "@/content";

export function LatestNews() {
  const t = useTranslations("home.news");
  const items = latestNews(3);

  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="home-news">
      <div className="page">
        <SectionHead id="home-news" heading={t("heading")} />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug} className="flex">
              <NewsCard item={item} className="w-full" />
            </li>
          ))}
        </ul>

        <SectionMore className="mt-6" links={[{ href: "/news", label: t("all") }]} />
      </div>
    </section>
  );
}
