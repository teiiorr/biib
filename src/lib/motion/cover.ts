import type { LogoBox } from "@/content/brand";

export interface CoverRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Media pikselidan quti pikseliga koʻpaytuvchi. */
  readonly s: number;
}

/**
 * Qahramon kadrining vertikal langari (home.css faylidagi object-position: 50% 75%). Kadr ekrandan
 * baland boʻlsa ortiqchaning chorak qismi pastdan kesiladi: belgi yuqoriroq turadi va noutbukda matn
 * bilan tugmalar bir ekranga sigʻadi.
 */
export const HERO_FOCUS_Y = 0.75;

/** object-fit: cover qilingan media toʻrtburchagi. */
export function coverRect(
  mediaW: number,
  mediaH: number,
  boxW: number,
  boxH: number,
  focusY = 0.5,
): CoverRect {
  const s = Math.max(boxW / mediaW, boxH / mediaH);
  const w = mediaW * s;
  const h = mediaH * s;
  return { x: (boxW - w) / 2, y: (boxH - h) * focusY, w, h, s };
}

/**
 * Doim bir ekran balandligida: matn uzun boʻlsa ham belgi pastga surilmaydi. Aks holda sikl hosil
 * boʻladi: kadr oʻssa belgi va matn tushadi, qahramon yana oʻsadi va telefonda sahna buziladi.
 */
export function heroMediaBox(hero: HTMLElement): {
  readonly width: number;
  readonly height: number;
} {
  const art = hero.querySelector<HTMLElement>("[data-hero-art]") ?? hero;
  return { width: art.clientWidth, height: art.clientHeight };
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
