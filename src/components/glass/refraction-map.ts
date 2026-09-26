/* Sinish xaritasi: skvirkl qirra profilidan feDisplacementMap uchun R=x, G=y tasviri. */

/* Xarita haqiqiy oʻlchamga yaqin chiziladi: past aniqlikda qirra tasmasi zinapoyaga aylanardi. */
const MAX_EDGE = 640;
const BEZEL_MIN = 10;
const BEZEL_MAX = 28;
const BEZEL_RATIO = 0.3;

export interface RefractionPixels {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray<ArrayBuffer>;
}

/**
 * Linza qirrasining kengligi (CSS px): sinish faqat shu tasmada, markaz buzilmaydi.
 * surface-effects siljish kuchini ham shundan oladi, shu sabab bitta funksiya.
 */
export function bezelWidth(width: number, height: number): number {
  const short = Math.min(width, height);
  return Math.min(BEZEL_MAX, Math.max(BEZEL_MIN, short * BEZEL_RATIO), short / 2 - 1);
}

function squircleDistance(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
): number {
  const px = Math.abs(x - halfWidth) - (halfWidth - radius);
  const py = Math.abs(y - halfHeight) - (halfHeight - radius);
  if (px > 0 && py > 0) return Math.sqrt(Math.sqrt(px ** 4 + py ** 4)) - radius;
  return Math.max(px, py) - radius;
}

/** Sof hisob: asosiy oqimda ham, workerda ham bir xil. Qirra tasmasidan tashqari piksellar neytral. */
export function renderRefractionPixels(
  width: number,
  height: number,
  radius: number,
): RefractionPixels {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(2, Math.round(width * scale));
  const h = Math.max(2, Math.round(height * scale));
  const halfWidth = w / 2;
  const halfHeight = h / 2;
  const bezel = Math.max(2, bezelWidth(width, height) * scale);
  /* Burchak radiusi kamida qirra kengligicha: aks holda burchak diagonalida normal sakrab,
     tasmada chok koʻrinardi. Haqiqiy burchak baribir elementning oʻz radiusi bilan kesiladi. */
  const r = Math.min(Math.max(radius * scale, bezel), halfWidth, halfHeight);
  const inner = Math.max(bezel, r) + 1;
  const distance = (x: number, y: number): number =>
    squircleDistance(x, y, halfWidth, halfHeight, r);

  const data = new Uint8ClampedArray(new ArrayBuffer(w * h * 4));
  data.fill(128);
  for (let y = 0; y < h; y += 1) {
    const rowInside = y >= inner && y < h - inner;
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      data[i + 3] = 255;
      if (rowInside && x >= inner && x < w - inner) continue;
      const d = distance(x + 0.5, y + 0.5);
      if (d <= -bezel) continue;
      /* Qavariq linza: nur normal tomon sinadi, qirrada ichkaridagi kontent choʻzilib koʻrinadi.
         (1 − t)² ichki chegarada silliq nolga tushadi, shu sabab tasma chegarasi koʻrinmaydi. */
      const t = Math.min(1, Math.max(0, -d / bezel));
      const magnitude = (1 - t) ** 2;
      const gx = distance(x + 1.5, y + 0.5) - distance(x - 0.5, y + 0.5);
      const gy = distance(x + 0.5, y + 1.5) - distance(x + 0.5, y - 0.5);
      const length = Math.hypot(gx, gy) || 1;
      data[i] = Math.round(128 - (gx / length) * magnitude * 127);
      data[i + 1] = Math.round(128 - (gy / length) * magnitude * 127);
    }
  }
  return { width: w, height: h, data };
}

/** Asosiy oqimdagi zaxira yoʻl (worker yoki OffscreenCanvas boʻlmasa): data URL. */
export function renderRefractionDataUrl(
  width: number,
  height: number,
  radius: number,
): string | null {
  if (typeof document === "undefined") return null;
  const pixels = renderRefractionPixels(width, height, radius);
  const canvas = document.createElement("canvas");
  canvas.width = pixels.width;
  canvas.height = pixels.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
  return canvas.toDataURL("image/png");
}
