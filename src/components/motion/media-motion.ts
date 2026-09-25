import { registerAmbient } from "@/lib/motion/ambient-governor";
import { DURATION, EASE } from "@/lib/motion/constants";
import { watchPending } from "@/lib/motion/watchdog";
import { willChangeDuring } from "@/lib/motion/will-change";

import type { MotionEngine } from "./engine-core";

/**
 * Media ramkasi ichida nima kesiladi va nima kattalashadi. Atlas: ramkaning oʻzi kesiladi (12 px
 * radius, soya yoʻq). Birlashma: qogʻoz bosma (oq hoshiya, soya, qiyalik) joyida qoladi — surat
 * qatlami ichida «ochiladi». Masshtab doim surat yoki videoning oʻzida: ustidagi 44 px boshqaruv
 * tugmasi kattalashmaydi va parallaksda ramka chetidan chiqib ketmaydi.
 */
export interface MediaTargets {
  readonly clip: HTMLElement;
  readonly scale: HTMLElement;
}

export function mediaTargets(box: HTMLElement): MediaTargets | null {
  // Ota qism (masalan Birlashma pardasi) media harakatini oʻzi boshqaradi.
  if (box.closest("[data-media-owner]")) return null;
  const layer = box.querySelector<HTMLElement>(".media-frame-media");
  const media = layer?.querySelector("video, img") ?? layer?.firstElementChild;
  if (!layer || !(media instanceof HTMLElement)) return null;
  const paper = document.documentElement.dataset.design === "birlashma";
  return { clip: paper ? layer : box, scale: media };
}

export interface RevealBuild {
  readonly mode: "abr" | "smooth";
  readonly delay?: number;
  readonly start?: string;
  /** Kirish tugagandagi masshtab: parallaks bor boʻlsa uning asosi (1 + chuqurlik). */
  readonly restScale?: number;
  readonly onDone?: () => void;
}

/**
 * media-reveal (motion-plan 3.6): bitta clip-path pardasi (chapdan oʻngga; abr — olti pogʻona) va
 * ichki qatlamning qarama-qarshi masshtabi 1.12 → 1. Blur yoʻq, qoʻshimcha DOM yoʻq.
 * Qaytgan funksiya qoʻriqchini tozalaydi (tweenlarni useEngineEffect konteksti qaytaradi).
 */
export function buildMediaReveal(
  { gsap }: MotionEngine,
  trigger: HTMLElement,
  targets: MediaTargets,
  { mode, delay = 0, start = "top 85%", restScale = 1, onDone }: RevealBuild,
): () => void {
  const radius = getComputedStyle(targets.clip).borderTopLeftRadius || "0px";
  let timeline: gsap.core.Timeline | null = null;
  const watch = watchPending(trigger, [trigger], () => {
    timeline?.scrollTrigger?.kill(false, true);
    timeline?.play();
  });
  timeline = gsap.timeline({
    delay,
    scrollTrigger: { trigger, start, once: true, onEnter: watch.started },
    ...(onDone ? { onComplete: onDone } : {}),
  });
  timeline
    .fromTo(
      targets.clip,
      { clipPath: `inset(0% 100% 0% 0% round ${radius})` },
      {
        clipPath: `inset(0% 0% 0% 0% round ${radius})`,
        duration: DURATION.transition,
        ease: mode === "abr" ? "steps(6)" : EASE.out,
        clearProps: "clipPath",
      },
      0,
    )
    .fromTo(
      targets.scale,
      { scale: 1.12, transformOrigin: "50% 50%" },
      {
        scale: restScale,
        duration: DURATION.imageReveal,
        ease: EASE.out,
        // Parallaks bilan birga boʻlsa masshtab tozalanmaydi: u parallaksning asosi.
        ...(restScale === 1 ? { clearProps: "transform" } : {}),
      },
      0,
    );
  willChangeDuring(timeline, [targets.scale], "transform");
  return watch.dispose;
}

/**
 * media-parallax (motion-plan 3.7): qatlam 1 + chuqurlik masshtabda ±chuqurlik/2 yuradi, chetlar
 * hech qachon ochilmaydi; scrub: true (D-M1). Boshqaruvchi orqali ekranda bitta skroll sahna.
 */
export function buildParallax(
  { gsap }: MotionEngine,
  box: HTMLElement,
  media: HTMLElement,
  depth: number,
): (() => void) | undefined {
  gsap.set(media, { scale: 1 + depth, transformOrigin: "50% 50%" });
  const tween = gsap.fromTo(
    media,
    { yPercent: -depth * 50 },
    {
      yPercent: depth * 50,
      ease: EASE.none,
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
  const trigger = tween.scrollTrigger;
  if (!trigger) return undefined;
  return registerAmbient(box, "scene", {
    pause: () => trigger.disable(false),
    resume: () => trigger.enable(false, false),
  });
}
