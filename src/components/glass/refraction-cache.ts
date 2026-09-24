import { whenIdle } from "@/lib/idle";

import type { RefractionRequest, RefractionResponse } from "./refraction.worker";
import { renderRefractionDataUrl } from "./refraction-map";

const cache = new Map<string, Promise<string | null>>();
let worker: Worker | null | undefined;
let nextId = 1;
const pending = new Map<number, (href: string | null) => void>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
    worker = null;
    return worker;
  }
  try {
    worker = new Worker(new URL("./refraction.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<RefractionResponse>) => {
      const resolve = pending.get(event.data.id);
      pending.delete(event.data.id);
      resolve?.(event.data.blob ? URL.createObjectURL(event.data.blob) : null);
    };
    worker.onerror = () => {
      /* Worker buzilsa navbatdagilar boʻsh qaytadi, keyingi soʻrovlar asosiy oqimda hisoblanadi. */
      for (const resolve of pending.values()) resolve(null);
      pending.clear();
      worker = null;
    };
  } catch {
    worker = null;
  }
  return worker;
}

function renderOnMainThreadWhenIdle(
  width: number,
  height: number,
  radius: number,
): Promise<string | null> {
  return new Promise((resolve) => {
    whenIdle(() => resolve(renderRefractionDataUrl(width, height, radius)), 1500);
  });
}

/**
 * Bir xil oʻlcham va radius uchun xarita bir marta hisoblanadi (sarlavha, tab-bar, tugmalar
 * koʻpincha bir xil). Chromium da worker, aks holda boʻsh vaqtda asosiy oqim.
 */
export function refractionMap(
  width: number,
  height: number,
  radius: number,
): Promise<string | null> {
  const key = `${width}:${height}:${radius}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const active = getWorker();
  const promise = active
    ? new Promise<string | null>((resolve) => {
        const id = nextId++;
        pending.set(id, resolve);
        const request: RefractionRequest = { id, width, height, radius };
        active.postMessage(request);
      }).then((href) => href ?? renderOnMainThreadWhenIdle(width, height, radius))
    : renderOnMainThreadWhenIdle(width, height, radius);
  cache.set(key, promise);
  return promise;
}
