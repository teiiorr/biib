import { PREPARED_IMAGES, type PreparedImage } from "@/lib/images/manifest";

import type { MediaItem } from "../news/types";

/** Bazadagi media qatorining panelga kerakli qismi. */
export interface MediaRowLike {
  readonly id: string;
  readonly src: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly variant_base: string | null;
  readonly variant_widths: readonly number[];
  readonly blur: string | null;
  readonly bright: boolean;
}

export const MEDIA_COLUMNS = "id, src, width, height, variant_base, variant_widths, blur, bright";

/** Qatordan <Picture image> shakli; statik rasm uchun kod manifesti ham yaraydi. */
export function preparedFromRow(row: MediaRowLike): PreparedImage | null {
  if (row.variant_base && row.variant_widths.length && row.width && row.height) {
    return {
      width: row.width,
      height: row.height,
      base: row.variant_base,
      widths: [...row.variant_widths],
      ...(row.blur ? { blur: row.blur } : {}),
      ...(row.bright ? { bright: true as const } : {}),
    };
  }
  return PREPARED_IMAGES[row.src] ?? null;
}

export function toMediaItem(row: MediaRowLike): MediaItem {
  return { id: row.id, src: row.src, image: preparedFromRow(row) };
}
