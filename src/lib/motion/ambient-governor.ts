/**
 * Viewportda bir vaqtning oʻzida koʻpi bilan bitta ambient sikl va bitta skroll sahna ishlaydi
 * (§8 XII.3). Eng koʻp koʻrinadigan aʼzo faol, qolganlari pauzada.
 */
export type AmbientKind = "ambient" | "scene";

export interface AmbientHandlers {
  readonly pause: () => void;
  readonly resume: () => void;
}

interface Entry extends AmbientHandlers {
  readonly id: number;
  readonly kind: AmbientKind;
  readonly el: Element;
  ratio: number;
  active: boolean;
}

export type PauseReason = "hidden" | "motion-off";

const entries = new Map<Element, Entry>();
const pauseReasons = new Set<PauseReason>();
let observer: IntersectionObserver | null = null;
let nextId = 1;
let listening = false;

function ensureObserver(): IntersectionObserver | null {
  if (observer || typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return observer;
  }
  observer = new IntersectionObserver(
    (records) => {
      for (const r of records) {
        const e = entries.get(r.target);
        if (e) e.ratio = r.isIntersecting ? r.intersectionRatio : 0;
      }
      reconcile();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  return observer;
}

function listenVisibility(): void {
  if (listening || typeof document === "undefined") return;
  listening = true;
  document.addEventListener("visibilitychange", () => {
    setGlobalPause("hidden", document.hidden);
  });
}

function apply(e: Entry, active: boolean): void {
  if (e.active === active) return;
  e.active = active;
  if (active) e.resume();
  else e.pause();
}

function reconcile(): void {
  const winners = new Map<AmbientKind, Entry>();
  for (const e of entries.values()) {
    if (e.ratio <= 0) continue;
    const current = winners.get(e.kind);
    // Teng koʻrinishda avval roʻyxatga olingan (sahifada yuqoridagi) gʻolib boʻladi.
    if (!current || e.ratio > current.ratio) winners.set(e.kind, e);
  }
  const paused = pauseReasons.size > 0;
  for (const e of entries.values()) {
    apply(e, !paused && winners.get(e.kind) === e);
  }
}

/** Yashirin varaq yoki Harakat = off: sabablar mustaqil, bittasi qolsa ham hammasi pauzada. */
export function setGlobalPause(reason: PauseReason, paused: boolean): void {
  const had = pauseReasons.has(reason);
  if (had === paused) return;
  if (paused) pauseReasons.add(reason);
  else pauseReasons.delete(reason);
  reconcile();
}

export function registerAmbient(
  el: Element,
  kind: AmbientKind,
  handlers: AmbientHandlers,
): () => void {
  const entry: Entry = { id: nextId++, kind, el, ratio: 0, active: false, ...handlers };
  entries.set(el, entry);
  listenVisibility();
  const io = ensureObserver();
  if (io) io.observe(el);
  else {
    // IntersectionObserver boʻlmasa hammasi koʻrinadi deb hisoblanadi.
    entry.ratio = 1;
    reconcile();
  }
  return () => {
    io?.unobserve(el);
    entries.delete(el);
    if (entry.active) entry.pause();
    reconcile();
  };
}

export function isAmbientActive(el: Element): boolean {
  return entries.get(el)?.active ?? false;
}

export function activeAmbientCount(kind?: AmbientKind): number {
  let n = 0;
  for (const e of entries.values()) if (e.active && (!kind || e.kind === kind)) n++;
  return n;
}
