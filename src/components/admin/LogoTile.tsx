import { Picture } from "@/components/ui/Picture";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";

interface LogoTileProps {
  readonly item: MediaItem | null;
  readonly sizes: string;
  /** Asl rangida (saytda ustiga kelgandagi koʻrinish); aks holda sut-oq siyohda, saytdagidek. */
  readonly original?: boolean;
  /** Oldindan koʻrishda maʼnoli rasm; roʻyxatdagi kichik plitka bezak (nomi yonida yozilgan). */
  readonly alt?: string;
}

/**
 * Saytdagidek qorongʻi sirt va partner-logo filtri: shaffof boʻlmagan logotip shu yerdayoq oq
 * toʻrtburchak boʻlib koʻrinadi.
 */
export function LogoTile({ item, sizes, original = false, alt = "" }: LogoTileProps) {
  return (
    <span className="admin-logo-tile" data-original={original ? "" : undefined}>
      {item?.src ? (
        <Picture
          src={item.src}
          image={item.image ?? undefined}
          alt={alt}
          width={item.image?.width ?? 240}
          height={item.image?.height ?? 160}
          sizes={sizes}
          className="partner-logo"
          eager
        />
      ) : (
        <AdminIcon name="building" size={20} className="text-ink-3" />
      )}
    </span>
  );
}
