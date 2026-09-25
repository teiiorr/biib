/**
 * Dvigatel kelganda oʻnlab sahnalar bir vaqtda quriladi (SplitText, ScrollTrigger oʻlchovlari):
 * bitta uzun vazifa oʻrniga ishlar kadrlarga boʻlinadi. Koʻrinishdagi elementlar navbatda oldinda.
 * Kadr byudjeti: foydalanuvchi kiritayotgan yoki yaqinda skroll qilgan boʻlsa 8 ms, aks holda 12 ms.
 */
type Job = { readonly run: () => void; readonly priority: number; readonly order: number };

interface Scheduling {
  readonly isInputPending?: () => boolean;
}

const queue: Job[] = [];
const drainListeners = new Set<() => void>();
let scheduled = false;
let order = 0;
let lastScroll = -Infinity;
let watchingScroll = false;
const BUSY_MS = 8;
const CALM_MS = 12;
const SCROLL_WINDOW_MS = 300;

function budget(): number {
  const scheduling = (navigator as Navigator & { scheduling?: Scheduling }).scheduling;
  const busy =
    scheduling?.isInputPending?.() === true || performance.now() - lastScroll < SCROLL_WINDOW_MS;
  return busy ? BUSY_MS : CALM_MS;
}

function watchScroll(): void {
  if (watchingScroll) return;
  watchingScroll = true;
  window.addEventListener(
    "scroll",
    () => {
      lastScroll = performance.now();
    },
    { passive: true },
  );
}

function flush(): void {
  scheduled = false;
  const start = performance.now();
  const limit = budget();
  let ran = false;
  // Barqaror tartib: teng ustuvorlikda DOM (navbatga qoʻyilish) tartibi saqlanadi.
  queue.sort((a, b) => a.priority - b.priority || a.order - b.order);
  while (queue.length > 0 && performance.now() - start < limit) {
    queue.shift()?.run();
    ran = true;
  }
  if (queue.length > 0) schedule();
  // Navbat boʻshaganda bitta umumiy yangilanish (har ish uchun emas).
  else if (ran) drainListeners.forEach((listener) => listener());
}

function schedule(): void {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(flush);
}

/** Element viewportga qancha yaqin boʻlsa, shuncha oldin ishlaydi (0 = koʻrinishda). */
export function viewportPriority(element: Element | null): number {
  if (!element) return 1;
  const rect = element.getBoundingClientRect();
  if (rect.bottom >= 0 && rect.top <= window.innerHeight) return 0;
  return Math.abs(rect.top) / Math.max(1, window.innerHeight);
}

/** Ishni navbatga qoʻyadi; qaytgan funksiya uni bekor qiladi (unmount). */
export function enqueueSliced(run: () => void, priority: number): () => void {
  watchScroll();
  const job: Job = { run, priority, order: order++ };
  queue.push(job);
  schedule();
  return () => {
    const index = queue.indexOf(job);
    if (index >= 0) queue.splice(index, 1);
  };
}

/** Navbat oxirgi ishdan keyin boʻshaganda chaqiriladi (masalan bitta ScrollTrigger.refresh). */
export function onQueueDrain(listener: () => void): () => void {
  drainListeners.add(listener);
  return () => {
    drainListeners.delete(listener);
  };
}

interface SchedulerYield {
  readonly yield?: () => Promise<void>;
}

/** Asosiy oqimga navbat berish: scheduler.yield boʻlsa u, aks holda nol taymer. */
export function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: SchedulerYield }).scheduler;
  if (scheduler && typeof scheduler.yield === "function") return scheduler.yield();
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
