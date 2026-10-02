import { MAGNET } from "./constants";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * [data-magnetic] tugmalar koʻrsatkichga tortiladi. Qiymat --mag-x/--mag-y orqali CSS translate
 * xossasiga beriladi (ui.css), shuning uchun bosishdagi scale bilan toʻqnashmaydi. Hujjatda bitta
 * tinglovchi, kadrda bitta oʻlchov. Bosilganda, aria-disabled holatida va sensorli kiritishda tortilmaydi.
 */
export function mountMagnetic(): () => void {
  if (typeof window === "undefined" || !window.matchMedia(FINE_POINTER).matches) {
    return () => undefined;
  }
  let active: HTMLElement | null = null;
  let frame = 0;
  let last: PointerEvent | null = null;

  const release = (el: HTMLElement | null): void => {
    if (!el) return;
    el.style.removeProperty("--mag-x");
    el.style.removeProperty("--mag-y");
  };

  const update = (): void => {
    frame = 0;
    const event = last;
    if (!event) return;
    const target =
      event.target instanceof Element ? event.target.closest<HTMLElement>("[data-magnetic]") : null;
    if (target !== active) {
      release(active);
      active = target;
    }
    if (!target || event.buttons !== 0 || target.getAttribute("aria-disabled") === "true") return;
    const rect = target.getBoundingClientRect();
    // Oʻtish davomida quti siljigan boʻladi: markaz joriy translate hisobga olinmasdan topiladi, aks holda tebranadi.
    const [shiftX = 0, shiftY = 0] = getComputedStyle(target)
      .translate.split(" ")
      .map((part) => parseFloat(part) || 0);
    const max = Number(target.dataset.magnetic) || MAGNET.max;
    const clamp = (value: number): number => Math.max(-max, Math.min(max, value));
    const x = clamp((event.clientX - (rect.left + rect.width / 2 - shiftX)) * MAGNET.strength);
    const y = clamp((event.clientY - (rect.top + rect.height / 2 - shiftY)) * MAGNET.strength);
    target.style.setProperty("--mag-x", `${x.toFixed(2)}px`);
    target.style.setProperty("--mag-y", `${y.toFixed(2)}px`);
  };

  const move = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    last = event;
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  const leave = (): void => {
    last = null;
    release(active);
    active = null;
  };

  document.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  window.addEventListener("blur", leave);
  window.addEventListener("scroll", leave, { passive: true });
  return () => {
    document.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    window.removeEventListener("blur", leave);
    window.removeEventListener("scroll", leave);
    window.cancelAnimationFrame(frame);
    leave();
  };
}
