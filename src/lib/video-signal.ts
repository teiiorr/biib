"use client";

/**
 * Video öynayotganini butun sahifaga bildiradi.
 *
 * Harakatlanayotgan video ustidagi backdrop-filter kompozitorni har kadrda
 * işlaşga majbur qiladi — örtaça Android da bu ~40 fps. Öynayotgan video
 * ostida xiralaştiradigan narsa yöq, şuning uçun sarlavha şu payt zich
 * tonlangan holatga ötadi. Kontekst emas, hodisa: eşituvçi bitta.
 */

const EVENT = "biib:video-playing";

/* Hodisadan keçikib obuna bölganlar uçun joriy holat ham saqlanadi —
 * video keşdan darrov ketsa, tugma "pauza" ni körsatişi kerak. */
let currentlyPlaying = false;

export function announceVideo(playing: boolean): void {
  currentlyPlaying = playing;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: playing }));
}

export function isVideoPlaying(): boolean {
  return currentlyPlaying;
}

export function onVideoPlaying(handler: (playing: boolean) => void): () => void {
  const listener = (event: Event) => handler(Boolean((event as CustomEvent<boolean>).detail));
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/*
 * ---- Qahramon videosining boşqaruvi ----
 * LivingVideo özini röyxatga oladi; pauza tugmasi (VideoToggle) DOM da
 * boşqa şoxda turadi — media aria-hidden qatlam içida, tugma esa yöq.
 * Şu registr ularni kontekstsiz bogʻlaydi. WCAG 2.2.2: beş soniyadan
 * uzun öz-özidan yuruvçi harakatni töxtatiş imkoni şart.
 */

type HeroVideoApi = {
  pause: () => void;
  play: () => void;
  available: boolean;
};

let heroVideo: HeroVideoApi | null = null;
const HERO_EVENT = "biib:hero-video";

export function registerHeroVideo(api: HeroVideoApi | null): void {
  heroVideo = api;
  window.dispatchEvent(new Event(HERO_EVENT));
}

export function getHeroVideo(): HeroVideoApi | null {
  return heroVideo;
}

export function onHeroVideoChange(handler: () => void): () => void {
  window.addEventListener(HERO_EVENT, handler);
  return () => window.removeEventListener(HERO_EVENT, handler);
}
