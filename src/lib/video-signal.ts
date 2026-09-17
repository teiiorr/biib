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

export function announceVideo(playing: boolean): void {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: playing }));
}

export function onVideoPlaying(handler: (playing: boolean) => void): () => void {
  const listener = (event: Event) => handler(Boolean((event as CustomEvent<boolean>).detail));
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
