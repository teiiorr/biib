import { Picture } from "@/components/ui/Picture";
import { Tag } from "@/components/ui/Tag";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { GalleryMedia } from "@/lib/admin/org/types";
import { cx } from "@/lib/cx";

interface GalleryThumbProps {
  readonly media: GalleryMedia | null;
  readonly alt: string;
  readonly sizes: string;
  /** Nisbat ramkasi (kartada 3:2); berilmasa ota katakni toʻldiradi (tuzilish xaritasi). */
  readonly ratio?: "3:2" | "1:1";
  readonly className?: string;
}

/** Galereya kadri: rasmning oʻzi yoki videoning posteri, videoda burchakda «video» yorligʻi. */
export function GalleryThumb({ media, alt, sizes, ratio, className }: GalleryThumbProps) {
  return (
    <div className={cx("admin-thumb admin-gallery-thumb", className)} data-ratio={ratio}>
      {media?.previewSrc ? (
        <Picture
          src={media.previewSrc}
          image={media.preview ?? undefined}
          alt={alt}
          fill
          sizes={sizes}
        />
      ) : null}
      {media?.kind === "video" ? (
        <Tag tone="accent" className="admin-gallery-kind">
          {UPOP_COPY.gallery.kinds.video}
        </Tag>
      ) : null}
    </div>
  );
}
