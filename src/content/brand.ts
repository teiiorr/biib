/**
 * Bosh sahifa qahramoni: egasining videosi (kadr markazida birlashma belgisi), scripts/media.mjs
 * chiqishi. Poster = halqaning 0-kadri, shuning uchun video poster ustida sezilmay boshlanadi.
 */
export interface HeroMediaVariant {
  readonly webm: string;
  readonly mp4: string;
  readonly poster: string;
  readonly width: number;
  readonly height: number;
}

export const HERO_MEDIA = {
  landscape: {
    webm: "/media/hero-d.webm",
    mp4: "/media/hero-d.mp4",
    poster: "/media/hero-d-poster.avif",
    width: 1280,
    height: 720,
  },
  portrait: {
    webm: "/media/hero-m.webm",
    mp4: "/media/hero-m.mp4",
    poster: "/media/hero-m-poster.avif",
    width: 720,
    height: 1280,
  },
} as const satisfies Record<"landscape" | "portrait", HeroMediaVariant>;

/**
 * Tik telefon va planshetlar 9:16 nusxani oladi: 16:9 kadr tik ekranda kengligining 60 % ini
 * yoʻqotadi. Poster <source>, preload va video manbasi bitta shartni ishlatadi.
 */
export const HERO_PORTRAIT_MEDIA = "(max-width: 1023px) and (orientation: portrait)";

export interface LogoBox {
  /** Markaz, kadr kengligi va balandligiga nisbatan (0–1). */
  readonly cx: number;
  readonly cy: number;
  /** Diametr, kadr balandligiga nisbatan. */
  readonly size: number;
}

/**
 * Oq doiraning 0-kadrdagi oʻrni, posterdan piksel boʻyicha oʻlchangan (sharp, oq ≥ 225, 2026-09-25):
 * kompyuter 1280×720 — x 502…773, y 164…433 (Ø 271); telefon 720×1280 — x 228…496, y 348…615 (Ø 268).
 * Pastki chekka (cy + size/2): 0.6028 va 0.4811 — home.css dagi --hero-logo-bottom shu qiymatlar.
 */
export const HERO_LOGO_BOX = {
  landscape: { cx: 0.498, cy: 0.4146, size: 0.3764 },
  portrait: { cx: 0.5028, cy: 0.3762, size: 0.2098 },
} as const satisfies Record<"landscape" | "portrait", LogoBox>;

/** Sahna ustidagi belgi: kadrdagi oq doira bilan bir xil chizma, shaffof fonli PNG. */
export const HERO_LOGO_OVERLAY = { src: "/brand/logo-mark.png", size: 256 } as const;
