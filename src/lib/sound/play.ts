import {
  createVoice,
  getAudioContext,
  hasUserGesture,
  playDoira,
  playPaper,
  playPencil,
  playXylophone,
} from "./synth";

export type SoundName = "doira" | "pencil" | "paper" | "xylophone";

export interface SoundOptions {
  /** Ksilofon uchun nota indeksi (0–5), boʻyoq rangiga mos. */
  readonly note?: number;
}

export function isSoundEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-sound") === "on";
}

/** Faqat Ovoz yoqilgan va foydalanuvchi allaqachon harakat qilgan boʻlsa chalinadi. */
export function playSound(name: SoundName, options?: SoundOptions): void {
  if (!isSoundEnabled() || !hasUserGesture()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const voice = createVoice(ctx);
  switch (name) {
    case "doira":
      playDoira(voice);
      return;
    case "pencil":
      playPencil(voice);
      return;
    case "paper":
      playPaper(voice);
      return;
    case "xylophone":
      playXylophone(voice, options?.note ?? 0);
      return;
  }
}
