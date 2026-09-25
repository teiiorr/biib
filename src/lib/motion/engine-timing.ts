import { ENGINE_IDLE_TIMEOUT } from "./constants";

/* Foydalanuvchi niyati: birinchisi boʻsh vaqtni kutmasdan dvigatelni chaqiradi. */
const INTENT_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
/* Safari da requestIdleCallback yoʻq: gidratsiyadan keyin qisqa taymer. */
const SAFARI_DELAY_MS = 250;

interface NetworkInformationLike {
  readonly saveData?: boolean;
  readonly effectiveType?: string;
}

/* Trafik tejash yoki 2g: dvigatel faqat niyatda, boʻsh vaqtda emas; mazmun usiz ham toʻliq. */
function constrained(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!connection) return false;
  return (
    connection.saveData === true ||
    connection.effectiveType === "2g" ||
    connection.effectiveType === "slow-2g"
  );
}

/**
 * Dvigatel qachon yuklanadi (motion-plan 2.2): gidratsiyadan keyin boʻsh vaqtda, koʻpi bilan
 * 800 ms kutib, yoki foydalanuvchining birinchi niyatida — qaysi biri oldin boʻlsa. window.load
 * kutilmaydi: LCP posteri HTML dan oldinroq soʻralgan, dvigatel u bilan raqobatlashmaydi.
 * Qaytgan funksiya rejani bekor qiladi.
 */
export function loadEngineWhen(load: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  let done = false;
  let idleId = 0;
  let timer = 0;
  const cleanup = (): void => {
    for (const type of INTENT_EVENTS) window.removeEventListener(type, fire);
    if (idleId && typeof window.cancelIdleCallback === "function")
      window.cancelIdleCallback(idleId);
    window.clearTimeout(timer);
  };
  function fire(): void {
    if (done) return;
    done = true;
    cleanup();
    load();
  }
  for (const type of INTENT_EVENTS) {
    window.addEventListener(type, fire, { passive: true, once: true });
  }
  if (!constrained()) {
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(fire, { timeout: ENGINE_IDLE_TIMEOUT });
    } else {
      timer = window.setTimeout(fire, SAFARI_DELAY_MS);
    }
  }
  return () => {
    done = true;
    cleanup();
  };
}
