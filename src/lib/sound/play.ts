export type SoundName = "doira" | "pencil" | "paper" | "xylophone";

export interface SoundOptions {
  /** Ksilofon uchun nota indeksi (0–5), boʻyoq rangiga mos. */
  readonly note?: number;
}

export function isSoundEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-sound") === "on";
}

/** Faqat Ovoz yoqilgan boʻlsa chalinadi; sintezator kodi shundagina yuklanadi (sukutda oʻchiq). */
export function playSound(name: SoundName, options?: SoundOptions): void {
  if (!isSoundEnabled()) return;
  void import("./synth").then((synth) => {
    if (!synth.hasUserGesture()) return;
    const ctx = synth.getAudioContext();
    if (!ctx) return;
    const voice = synth.createVoice(ctx);
    switch (name) {
      case "doira":
        synth.playDoira(voice);
        return;
      case "pencil":
        synth.playPencil(voice);
        return;
      case "paper":
        synth.playPaper(voice);
        return;
      case "xylophone":
        synth.playXylophone(voice, options?.note ?? 0);
        return;
    }
  });
}
