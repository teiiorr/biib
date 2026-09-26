/**
 * Bosh sahifa qahramoni: egasining Higgsfield videosi (oltin kitob, bolalar, samolyotcha va yulduzlar
 * belgiga yigʻiladi), scripts/hero-video.mts chiqishi. Bir marta ijro etiladi: poster = 0-kadr (video
 * uning ustida sezilmay boshlanadi), end = oxirgi kadr (harakat oʻchiq yoki video hali kelmagan).
 */
export interface HeroMediaVariant {
  readonly webm: string;
  readonly mp4: string;
  readonly poster: string;
  readonly end: string;
  readonly width: number;
  readonly height: number;
}

export const HERO_MEDIA = {
  landscape: {
    webm: "/media/hero-d.webm",
    mp4: "/media/hero-d.mp4",
    poster: "/media/hero-d-poster.avif",
    end: "/media/hero-d-end.avif",
    width: 1920,
    height: 1080,
  },
  portrait: {
    webm: "/media/hero-m.webm",
    mp4: "/media/hero-m.mp4",
    poster: "/media/hero-m-poster.avif",
    end: "/media/hero-m-end.avif",
    width: 1080,
    height: 1920,
  },
} as const satisfies Record<"landscape" | "portrait", HeroMediaVariant>;

/** Belgi toʻliq yigʻilgan lahza (s): sarlavha shu paytda oltin chaqnaydi. */
export const HERO_LOCK_AT = 7.8;

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
 * Oxirgi kadrdagi oltin belgining oʻrni, kadrdan piksel boʻyicha oʻlchangan (2026-09-26): kompyuter
 * 1920×1080 — x 754…1157, y 245…649 (Ø 404); telefon 1080×1920 — markaz 0.4944 / 0.375, Ø 376.
 * Pastki chekka (cy + size/2): 0.6010 va 0.4729 — home.css dagi --hero-logo-bottom shu qiymatlar.
 */
export const HERO_LOGO_BOX = {
  landscape: { cx: 0.4977, cy: 0.4139, size: 0.3741 },
  portrait: { cx: 0.4944, cy: 0.375, size: 0.1958 },
} as const satisfies Record<"landscape" | "portrait", LogoBox>;

/** Sahna ustidagi belgi: oxirgi kadrdan doira niqobi bilan kesilgan (kadrdagi belgi bilan aynan bir xil). */
export const HERO_LOGO_OVERLAY = { src: "/brand/logo-hero.png", size: 408 } as const;
