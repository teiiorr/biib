import type { MediaRevealProps } from "@/components/motion/MediaReveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { t } from "@/content";
import type { NewsArticle } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/aspect-ratio";

export interface NewsCoverProps {
  readonly article: Pick<NewsArticle, "cover">;
  readonly ratio: AspectRatio;
  readonly locale: Locale;
  /** Ramka viewportning qancha qismini egallaydi (srcset tanlovi uchun). */
  readonly sizes: string;
  /** Maʼnoli surat (maqola boshi): alt matni oʻqiladi; aks holda bezak, sarlavha havolasi yetarli. */
  readonly meaningful?: boolean;
  readonly priority?: boolean;
  /** Muqova kirishi va parallaks; maqola boshida umumiy element kirish oʻrnida (faqat parallaks). */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
}

/**
 * Yangilik muqovasi: surat bor va tasdiq kutmayotgan boʻlsa tayyor rasm (Picture), aks holda sokin oʻrin
 * (neytral yengil zamin va markazda birlashma belgisi).
 */
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
        <Picture src={src} alt={alt} fill sizes={sizes} priority={priority} />
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
