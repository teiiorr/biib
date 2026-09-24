/**
 * Dvigatel kelganda oʻnlab sahnalar bir vaqtda quriladi (SplitText, ScrollTrigger oʻlchovlari):
 * bitta uzun vazifa oʻrniga ishlar kadrlarga boʻlinadi, har kadrda ≤ 8 ms. Koʻrinishdagi
 * elementlar navbatda oldinda.
 */
type Job = { readonly run: () => void; readonly priority: number };

const queue: Job[] = [];
let scheduled = false;
const BUDGET_MS = 8;

function flush(): void {
  scheduled = false;
  const start = performance.now();
  queue.sort((a, b) => a.priority - b.priority);
  while (queue.length > 0 && performance.now() - start < BUDGET_MS) {
    const job = queue.shift();
    job?.run();
  }
  if (queue.length > 0) schedule();
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
  const job: Job = { run, priority };
  queue.push(job);
  schedule();
  return () => {
    const index = queue.indexOf(job);
    if (index >= 0) queue.splice(index, 1);
  };
}
