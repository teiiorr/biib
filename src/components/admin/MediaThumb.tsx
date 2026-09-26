import { Picture } from "@/components/ui/Picture";
import type { MediaItem } from "@/lib/admin/news/types";
import { cx } from "@/lib/cx";

interface MediaThumbProps {
  readonly item: MediaItem | null;
  readonly alt: string;
  readonly ratio: "3:2" | "1:1";
  /** srcset tanlovi uchun ramka kengligi. */
  readonly sizes: string;
  /** Hozirgina yuklangan rasm oldindan koʻrishi: dangasa yuklanmaydi. */
  readonly eager?: boolean;
  readonly className?: string;
}

/** Panel ichidagi rasm ramkasi: nisbat qulflangan, rasm yoʻq boʻlsa sokin boʻsh maydon. */
export function MediaThumb({ item, alt, ratio, sizes, eager = false, className }: MediaThumbProps) {
  return (
    <div className={cx("admin-thumb", className)} data-ratio={ratio}>
      {item?.src ? (
        <Picture
          src={item.src}
          image={item.image ?? undefined}
          alt={alt}
          fill
          sizes={sizes}
          eager={eager}
        />
      ) : null}
    </div>
  );
}
