export type SoundName = "doira";

export function isSoundEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-sound") === "on";
}

/** Faqat Ovoz yoqilgan boʻlsa chalinadi; sintezator kodi shundagina yuklanadi (sukutda oʻchiq). */
export function playSound(name: SoundName): void {
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
    }
  });
}
