/* Sinish xaritasi: skvirkl qirra profilidan feDisplacementMap uchun R=x, G=y tasviri. */

const MAX_EDGE = 256;
const REFRACTIVE_INDEX = 1.5;
/* Qirraning eng chetida sinish burchagi eng katta: normallash uchun oʻsha qiymat. */
const MAX_TANGENT = Math.tan(Math.PI / 2 - Math.asin(1 / REFRACTIVE_INDEX));

function roundedSquircleDistance(
  x: number,
  y: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
): number {
  const px = Math.abs(x - halfWidth) - (halfWidth - radius);
  const py = Math.abs(y - halfHeight) - (halfHeight - radius);
  if (px > 0 && py > 0) return Math.pow(px ** 4 + py ** 4, 0.25) - radius;
  return Math.max(px, py) - radius;
}

function refractionMagnitude(t: number): number {
  const rise = 1 - t;
  const slope = rise / Math.sqrt(Math.max(1e-4, 1 - rise * rise));
  const incidence = Math.atan(slope);
  const refracted = Math.asin(Math.sin(incidence) / REFRACTIVE_INDEX);
  return Math.min(1, Math.tan(incidence - refracted) / MAX_TANGENT);
}

export function generateRefractionMap(
  width: number,
  height: number,
  radius: number,
): string | null {
  if (typeof document === "undefined") return null;
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(2, Math.round(width * scale));
  const h = Math.max(2, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const halfWidth = w / 2;
  const halfHeight = h / 2;
  const r = Math.min(radius * scale, halfWidth, halfHeight);
  const bezel = Math.max(3, Math.min(w, h) * 0.22);
  const distance = (x: number, y: number): number =>
    roundedSquircleDistance(x, y, halfWidth, halfHeight, r);

  const image = ctx.createImageData(w, h);
  const data = image.data;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const d = distance(x + 0.5, y + 0.5);
      let dx = 0;
      let dy = 0;
      if (d > -bezel && d <= 0) {
        const magnitude = refractionMagnitude(-d / bezel);
        const gx = distance(x + 1.5, y + 0.5) - distance(x - 0.5, y + 0.5);
        const gy = distance(x + 0.5, y + 1.5) - distance(x + 0.5, y - 0.5);
        const length = Math.hypot(gx, gy) || 1;
        dx = (gx / length) * magnitude;
        dy = (gy / length) * magnitude;
      }
      const i = (y * w + x) * 4;
      data[i] = Math.round(128 + dx * 127);
      data[i + 1] = Math.round(128 + dy * 127);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}
