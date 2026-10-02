import type { MediaRevealProps } from "@/components/motion/MediaReveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ContentPicture } from "@/components/ui/ContentPicture";
import { t } from "@/content";
import type { NewsArticle } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/aspect-ratio";

export interface NewsCoverProps {
  readonly article: Pick<NewsArticle, "cover">;
  readonly ratio: AspectRatio;
  readonly locale: Locale;
  /** Ramka ekranning qancha qismini egallaydi: srcset tanlovi uchun. */
  readonly sizes: string;
  /** Maʼnoli surat (maqola boshi): alt matni oʻqiladi; aks holda bezak, sarlavha havolasi yetarli. */
  readonly meaningful?: boolean;
  readonly priority?: boolean;
  /** Maqola boshida kirishni umumiy element bajaradi, u yerda faqat parallaks qoladi. */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
}

/** Surat yoʻq yoki tasdiq kutilayotgan boʻlsa neytral zamin va markazda belgi chiziladi. */
export function NewsCover({
  article,
  ratio,
  locale,
  sizes,
  meaningful = false,
  priority = false,
  motion,
  className,
}: NewsCoverProps) {
  const { cover } = article;
  const alt = meaningful ? t(cover.alt, locale) : "";
  const src = cover.status === "pending" ? null : cover.src;
  return (
    <MediaFrame
      ratio={ratio}
      className={cn("news-cover", className)}
      {...(src ? { tone: "dark" as const } : {})}
      {...(motion ? { motion } : {})}
    >
      {src ? (
        <ContentPicture src={src} alt={alt} fill sizes={sizes} priority={priority} />
      ) : (
        <div
          className="news-cover-placeholder"
          data-status={cover.status}
          {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
        >
          <BrandLogo alt="" size={40} />
        </div>
      )}
    </MediaFrame>
  );
}
