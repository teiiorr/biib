import type { gsap } from "gsap";

type Animation = gsap.core.Animation;
type Callback = "onStart" | "onComplete" | "onInterrupt" | "onReverseComplete";

function resolveTargets(anim: Animation, explicit?: readonly Element[]): Element[] {
  if (explicit) return [...explicit];
  const withTargets = anim as Animation & { targets?: () => unknown[] };
  if (typeof withTargets.targets !== "function") return [];
  return withTargets.targets().filter((t): t is Element => t instanceof Element);
}

function chain(anim: Animation, name: Callback, extra: () => void): void {
  const previous = anim.eventCallback(name) as gsap.Callback | null;
  anim.eventCallback(name, () => {
    extra();
    previous?.();
  });
}

/**
 * will-change faqat animatsiya davomida turadi (§14.5): doimiy qatlam GPU xotirasini yeydi.
 * Timeline uchun nishonlar aniq berilishi kerak, chunki timeline oʻz nishonlarini bilmaydi.
 */
export function willChangeDuring<T extends Animation>(
  anim: T,
  targets?: readonly Element[],
  value = "transform, opacity",
): T {
  const els = resolveTargets(anim, targets).filter(
    (el): el is HTMLElement | SVGElement => el instanceof HTMLElement || el instanceof SVGElement,
  );
  if (els.length === 0) return anim;
  const set = () => els.forEach((el) => el.style.setProperty("will-change", value));
  const clear = () => els.forEach((el) => el.style.removeProperty("will-change"));
  chain(anim, "onStart", set);
  chain(anim, "onComplete", clear);
  chain(anim, "onReverseComplete", clear);
  chain(anim, "onInterrupt", clear);
  return anim;
}
