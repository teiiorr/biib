import type { CSSProperties } from "react";
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
    <section
      className="section relative isolate overflow-hidden"
      aria-labelledby="home-news"
      style={{ "--gem": "var(--magenta)", "--gem2": "var(--violet)" } as CSSProperties}
    >
      <div aria-hidden="true" className="gem-wash" />
      <div className="page relative">
        <Reveal>
          <SectionHead id="home-news" heading={t("heading")} />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 90} index={index} className="flex">
              <NewsCard item={item} priority={index === 0} className="w-full" />
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
