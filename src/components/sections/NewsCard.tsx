import Image from "next/image";
import { useLocale } from "next-intl";
import { CoverPlaceholder } from "@/components/brand/Placeholder";
import { Link } from "@/i18n/navigation";
import { pick } from "@/content";
import type { NewsItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { formatDate, isoDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Plakat karta: avval muqova, keyin "sana · mavzu" oddiy matn, keyin sarlavha.
 * Butun karta bosiladi, ammo havolaning nomi — sarlavhaning özi.
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
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft",
        "transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)]",
        "hover:-translate-y-1.5 hover:rotate-[-0.7deg] hover:shadow-lift",
        "focus-within:-translate-y-1.5 focus-within:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 [container-type:inline-size]">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={pick(item.coverAlt, locale)}
            fill
            priority={priority}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-[1.04]"
          />
        ) : (
          <CoverPlaceholder accent={item.accent} topic={pick(item.topic, locale)} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
        <p className="lines-1 text-[0.9rem] font-semibold leading-[1.5] text-ink-muted">
          <time dateTime={isoDate(item.date)}>{formatDate(item.date, locale, "long")}</time>
          {/* Muqova böş bölsa mavzu öşa yerda katta yozilgan — takrorlamaymiz. */}
          {item.cover ? ` · ${pick(item.topic, locale)}` : null}
        </p>

        <h3 className="lines-3 text-[1.22rem] leading-[1.3] sm:text-[1.3rem]">
          <Link
            href={{ pathname: "/news/[slug]", params: { slug: item.slug } }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {pick(item.title, locale)}
          </Link>
        </h3>
      </div>
    </article>
  );
}
