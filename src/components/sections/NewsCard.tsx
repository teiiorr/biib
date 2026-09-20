import Image from "next/image";
import { useLocale } from "next-intl";
import { CoverPlaceholder } from "@/components/brand/Placeholder";
import { GemCard } from "@/components/ui/GemCard";
import { Link } from "@/i18n/navigation";
import { pick } from "@/content";
import type { NewsItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { formatDate, isoDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Muqova boşda, keyin mavzu va sana, keyin sarlavha.
 * Mavzu bilan sana " · " orqali birlaştirilmaydi (§12) — bular ikki
 * alohida maydon, orasi boşliq bilan ajratiladi.
 *
 * `featured` — bosh yangilik: kattaroq muqova, sarlavha va kiriş matni,
 * ravoq toji balandroq (arkeyni yassilamaslik uçun).
 */
export function NewsCard({
  item,
  className,
  priority = false,
  featured = false,
}: {
  item: NewsItem;
  className?: string;
  priority?: boolean;
  featured?: boolean;
}) {
  const locale = useLocale() as Locale;

  return (
    <GemCard accent={item.accent} interactive className={cn(featured && "is-featured", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-sunken",
          featured ? "aspect-[3/2]" : "aspect-[16/11]",
        )}
      >
        {item.cover ? (
          <Image
            src={item.cover}
            alt={pick(item.coverAlt, locale)}
            fill
            priority={priority}
            sizes={
              featured
                ? "(max-width: 640px) 92vw, 62vw"
                : "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            }
            className="parallax-media object-cover"
          />
        ) : (
          <CoverPlaceholder topic={pick(item.topic, locale)} />
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5 @[20rem]:p-6",
          featured && "@[30rem]:gap-4 @[30rem]:p-8",
        )}
      >
        <p className="flex flex-wrap items-baseline gap-x-3 text-footnote">
          <span className="font-medium text-accent-text">{pick(item.topic, locale)}</span>
          <time dateTime={isoDate(item.date)} className="text-label-secondary">
            {formatDate(item.date, locale, "long")}
          </time>
        </p>

        <h3 className={cn(featured ? "text-title2 @[30rem]:text-title1" : "text-title3 @[20rem]:text-title2")}>
          <Link
            href={{ pathname: "/news/[slug]", params: { slug: item.slug } }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {pick(item.title, locale)}
          </Link>
        </h3>

        {featured ? (
          <p className="line-clamp-2 max-w-prose text-callout text-label-secondary @[30rem]:text-body">
            {pick(item.lead, locale)}
          </p>
        ) : null}
      </div>
    </GemCard>
  );
}
