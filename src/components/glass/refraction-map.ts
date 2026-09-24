/* Sinish xaritasi: skvirkl qirra profilidan feDisplacementMap uchun R=x, G=y tasviri. */

const MAX_EDGE = 128;
const REFRACTIVE_INDEX = 1.5;
/* Qirraning eng chetida sinish burchagi eng katta: normallash uchun oʻsha qiymat. */
const MAX_TANGENT = Math.tan(Math.PI / 2 - Math.asin(1 / REFRACTIVE_INDEX));
const LUT_SIZE = 256;

export interface RefractionPixels {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray<ArrayBuffer>;
}

function roundedSquircleDistance(
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

function refractionMagnitude(t: number): number {
  const rise = 1 - t;
  const slope = rise / Math.sqrt(Math.max(1e-4, 1 - rise * rise));
  const incidence = Math.atan(slope);
  const refracted = Math.asin(Math.sin(incidence) / REFRACTIVE_INDEX);
  return Math.min(1, Math.tan(incidence - refracted) / MAX_TANGENT);
}

/* Trigonometriya har piksel uchun emas: 256 qadamli jadval bir marta hisoblanadi. */
let lut: Float32Array | null = null;
function magnitudeTable(): Float32Array {
  if (lut) return lut;
  lut = new Float32Array(LUT_SIZE);
  for (let i = 0; i < LUT_SIZE; i += 1) lut[i] = refractionMagnitude(i / (LUT_SIZE - 1));
  return lut;
}

/** Sof hisob: asosiy oqimda ham, workerda ham bir xil. Chet tasmasidan tashqari piksellar neytral. */
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
  const r = Math.min(radius * scale, halfWidth, halfHeight);
  const bezel = Math.max(3, Math.min(w, h) * 0.22);
  const table = magnitudeTable();
  const distance = (x: number, y: number): number =>
    roundedSquircleDistance(x, y, halfWidth, halfHeight, r);

  const data = new Uint8ClampedArray(new ArrayBuffer(w * h * 4));
  data.fill(128);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      data[i + 3] = 255;
      const d = distance(x + 0.5, y + 0.5);
      if (d <= -bezel || d > 0) continue;
      const magnitude =
        table[Math.min(LUT_SIZE - 1, Math.round((-d / bezel) * (LUT_SIZE - 1)))] ?? 0;
      const gx = distance(x + 1.5, y + 0.5) - distance(x - 0.5, y + 0.5);
      const gy = distance(x + 0.5, y + 1.5) - distance(x + 0.5, y - 0.5);
      const length = Math.hypot(gx, gy) || 1;
      data[i] = Math.round(128 + (gx / length) * magnitude * 127);
      data[i + 1] = Math.round(128 + (gy / length) * magnitude * 127);
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
