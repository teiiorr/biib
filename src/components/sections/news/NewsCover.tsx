import type { CSSProperties } from "react";

import type { MediaRevealProps } from "@/components/motion/MediaReveal";
import { GirihStar } from "@/components/ornament/GirihStar";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { t } from "@/content";
import type { NewsArticle } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/ornament/ratio";

export interface NewsCoverProps {
  readonly article: Pick<NewsArticle, "cover" | "story">;
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
 * (hikoya rangida yengil zamin va kichik belgi). Naqshli tasmalar yoʻq.
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
  const { cover, story } = article;
  const alt = meaningful ? t(cover.alt, locale) : "";
  const src = cover.status === "pending" ? null : cover.src;
  const style = { "--cover-tint": `var(--${story.primary})` } as CSSProperties;
  return (
    <MediaFrame
      ratio={ratio}
      className={cn("news-cover", className)}
      style={style}
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
          <GirihStar symmetry={8} size={20} ring={false} />
        </div>
      )}
    </MediaFrame>
  );
}
