import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { NewsCard } from "@/components/sections/NewsCard";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { latestNews } from "@/content";
import { cn } from "@/lib/cn";

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

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:auto-rows-[minmax(0,1fr)]">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.slug}
              delay={index * 90}
              index={index}
              className={cn("flex", index === 0 && "sm:col-span-2 lg:row-span-2")}
            >
              <NewsCard
                item={item}
                featured={index === 0}
                priority={index === 0}
                className="w-full"
              />
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
