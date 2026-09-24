/**
 * Ogʻir qismlar (harakat dvigateli, oyna panellari, badiiy chunklar) birinchi chizishdan keyin,
 * sahifa toʻliq yuklangach va brauzer boʻsh boʻlganda olinadi. Safari da requestIdleCallback yoʻq:
 * qisqa taymer bilan almashtiriladi. Qaytgan funksiya rejani bekor qiladi.
 */
export function whenIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof window === "undefined") return () => undefined;
  let cancelled = false;
  let idleId = 0;
  let timer = 0;
  const run = (): void => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(
        () => {
          if (!cancelled) callback();
        },
        { timeout },
      );
      return;
    }
    timer = window.setTimeout(() => {
      if (!cancelled) callback();
    }, 300);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId && typeof window.cancelIdleCallback === "function")
      window.cancelIdleCallback(idleId);
    window.clearTimeout(timer);
  };
}
