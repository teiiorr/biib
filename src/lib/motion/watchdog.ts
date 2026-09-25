/**
 * «Havo qolmasin» qoʻriqchisi: reveal yashirgan element (data-reveal="pending") koʻrinishning kamida
 * yarmida 300 ms tursa-yu, trigger ishlamagan boʻlsa (pastki 15 % dagi blok, kech rasm yoki shriftdan
 * keyin oʻtkazib yuborilgan refresh), kirishi triggersiz oʻynaladi. Bitta umumiy IntersectionObserver.
 */
const HOLD_MS = 300;
const VISIBLE_SHARE = 0.5;

interface Watch {
  readonly finish: () => void;
  timer: number;
}

const watches = new Map<Element, Set<Watch>>();
let observer: IntersectionObserver | null = null;

/* Baland blokda nisbat hech qachon 0.5 ga yetmaydi: ulush element yoki viewport balandligidan olinadi. */
function share(entry: IntersectionObserverEntry): number {
  const height = Math.min(entry.boundingClientRect.height, window.innerHeight);
  return height > 0 ? entry.intersectionRect.height / height : 0;
}

function remove(trigger: Element, watch: Watch): void {
  window.clearTimeout(watch.timer);
  const set = watches.get(trigger);
  if (!set) return;
  set.delete(watch);
  if (set.size === 0) {
    watches.delete(trigger);
    observer?.unobserve(trigger);
  }
}

function ensureObserver(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const set = watches.get(entry.target);
        if (!set) continue;
        const visible = share(entry) >= VISIBLE_SHARE;
        for (const watch of set) {
          window.clearTimeout(watch.timer);
          if (!visible) continue;
          watch.timer = window.setTimeout(() => {
            remove(entry.target, watch);
            watch.finish();
          }, HOLD_MS);
        }
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  return observer;
}

export interface PendingWatch {
  /** Trigger ishladi: belgi olinadi, qoʻriqchi toʻxtaydi. */
  readonly started: () => void;
  readonly dispose: () => void;
}

/**
 * Nishonlarga data-reveal="pending" qoʻyadi va qoʻriqchiga topshiradi; `finish` qoʻriqchi
 * ishlaganda chaqiriladi (trigger animatsiyani oʻldirmasdan olinadi, kirish oʻynaladi).
 */
export function watchPending(
  trigger: Element,
  targets: readonly Element[],
  finish: () => void,
): PendingWatch {
  for (const el of targets) el.setAttribute("data-reveal", "pending");
  const clear = (): void => {
    for (const el of targets) el.removeAttribute("data-reveal");
  };
  const watch: Watch = {
    finish: () => {
      clear();
      finish();
    },
    timer: 0,
  };
  const io = ensureObserver();
  if (io) {
    const set = watches.get(trigger) ?? new Set<Watch>();
    set.add(watch);
    watches.set(trigger, set);
    io.observe(trigger);
  }
  const stop = (): void => {
    remove(trigger, watch);
    clear();
  };
  return { started: stop, dispose: stop };
}
