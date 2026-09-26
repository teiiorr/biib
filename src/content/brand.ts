/**
 * Bosh sahifa qahramoni: egasining Higgsfield videosi (oltin kitob, bolalar, samolyotcha va yulduzlar
 * belgiga yigʻiladi), scripts/hero-video.mts chiqishi. Bir marta ijro etiladi: poster = 0-kadr (video
 * uning ustida sezilmay boshlanadi), end = oxirgi kadr (harakat oʻchiq yoki video hali kelmagan).
 */
export interface HeroMediaVariant {
  readonly mp4: string;
  readonly poster: string;
  readonly end: string;
  readonly width: number;
  readonly height: number;
}

/* Skroll bilan boshqariladigan video (scripts/hero-video.mts): H.264, zich kalit kadrlar. */
export const HERO_MEDIA = {
  landscape: {
    mp4: "/media/hero-scrub-d.mp4",
    poster: "/media/hero-scrub-d-poster.avif",
    end: "/media/hero-scrub-d-end.avif",
    width: 1920,
    height: 1080,
  },
  portrait: {
    mp4: "/media/hero-scrub-m.mp4",
    poster: "/media/hero-scrub-m-poster.avif",
    end: "/media/hero-scrub-m-end.avif",
    width: 720,
    height: 1280,
  },
} as const satisfies Record<"landscape" | "portrait", HeroMediaVariant>;

/** Qirqilgan videoning uzunligi (s): metamaʼlumot kelguncha skroll shu bilan hisoblanadi. */
export const HERO_SCRUB_DURATION = 8.04;

/** Belgi toʻliq yigʻilgan lahza (s, qirqilgan videoda): sarlavha shu paytda oltin chaqnaydi. */
export const HERO_LOCK_AT = 5.8;

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
