import type { LogoBox } from "@/content/brand";

export interface CoverRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Media pikselidan quti pikseliga koʻpaytuvchi. */
  readonly s: number;
}

/** object-fit: cover ostidagi media toʻrtburchagi: quti toʻlguncha kattalashtiriladi, ortiqchasi teng kesiladi. */
export function coverRect(mediaW: number, mediaH: number, boxW: number, boxH: number): CoverRect {
  const s = Math.max(boxW / mediaW, boxH / mediaH);
  const w = mediaW * s;
  const h = mediaH * s;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h, s };
}

export interface LogoRect {
  /** Markaz, quti koordinatalarida (px). */
  readonly cx: number;
  readonly cy: number;
  readonly size: number;
}

/** Kadrga pishirilgan belgining quti ichidagi oʻrni: cover toʻrtburchagi × nisbiy quti. */
export function logoRect(cover: CoverRect, box: LogoBox): LogoRect {
  return {
    cx: cover.x + box.cx * cover.w,
    cy: cover.y + box.cy * cover.h,
    size: box.size * cover.h,
  };
}
