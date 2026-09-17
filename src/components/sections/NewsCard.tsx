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
 */
export function NewsCard({
  item,
  className,
  priority = false,
}: {
  item: NewsItem;
  className?: string;
  priority?: boolean;
}) {
  const locale = useLocale() as Locale;

  return (
    <GemCard accent={item.accent} interactive className={cn("flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-sunken">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={pick(item.coverAlt, locale)}
            fill
            priority={priority}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover"
          />
        ) : (
          <CoverPlaceholder topic={pick(item.topic, locale)} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex flex-wrap items-baseline gap-x-3 text-footnote">
          <span className="font-medium text-accent-text">{pick(item.topic, locale)}</span>
          <time dateTime={isoDate(item.date)} className="text-label-secondary">
            {formatDate(item.date, locale, "long")}
          </time>
        </p>

        <h3 className="text-title3">
          <Link
            href={{ pathname: "/news/[slug]", params: { slug: item.slug } }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {pick(item.title, locale)}
          </Link>
        </h3>
      </div>
    </GemCard>
  );
}
