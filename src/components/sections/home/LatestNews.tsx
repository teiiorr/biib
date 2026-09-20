import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
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
        <Reveal>
          <SectionHead id="home-news" heading={t("heading")} />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 90} index={index} className="flex">
              <NewsCard item={item} className="w-full" />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120} className="mt-6">
          <SectionMore links={[{ href: "/news", label: t("all") }]} />
        </Reveal>
      </div>
    </section>
  );
}
