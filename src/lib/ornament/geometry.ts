export interface Point {
  readonly x: number;
  readonly y: number;
}

export const DEG = Math.PI / 180;

export function polar(center: Point, radius: number, angleDeg: number): Point {
  return {
    x: center.x + radius * Math.cos(angleDeg * DEG),
    y: center.y + radius * Math.sin(angleDeg * DEG),
  };
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(p: Point, k: number): Point {
  return { x: p.x * k, y: p.y * k };
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function length(p: Point): number {
  return Math.hypot(p.x, p.y);
}

export function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function normalize(p: Point): Point {
  const l = length(p);
  return l === 0 ? { x: 0, y: 0 } : { x: p.x / l, y: p.y / l };
}

export function cross(a: Point, b: Point): number {
  return a.x * b.y - a.y * b.x;
}

export function dot(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

/** Soat miliga qarshi 90°: ccw koʻpburchak uchun ichki normal. */
export function perp(p: Point): Point {
  return { x: -p.y, y: p.x };
}

/** Musbat qiymat ccw tartibni bildiradi. */
export function signedArea(points: readonly Point[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    if (a && b) area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

/** SVG uchun qisqa, barqaror son: sukutda 3 kasr, ortiqcha nollar va -0 yoʻq. */
export function fmt(n: number, decimals = 3): string {
  const k = 10 ** decimals;
  const rounded = Math.round(n * k) / k;
  const safe = Object.is(rounded, -0) ? 0 : rounded;
  return String(safe);
}

export function pointKey(p: Point, precision = 3): string {
  const k = 10 ** precision;
  const x = Math.round(p.x * k) / k;
  const y = Math.round(p.y * k) / k;
  return `${Object.is(x, -0) ? 0 : x},${Object.is(y, -0) ? 0 : y}`;
}

/** Piksel koordinatalar uchun 2 kasr yetarli: chiqish hajmi kichik boʻladi. */
export function polylinePath(points: readonly Point[], close = false, decimals = 2): string {
  if (points.length === 0) return "";
  const parts = points.map(
    (p, i) => `${i === 0 ? "M" : "L"}${fmt(p.x, decimals)} ${fmt(p.y, decimals)}`,
  );
  return parts.join(" ") + (close ? " Z" : "");
}

export function pointInPolygon(p: Point, polygon: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if (!a || !b) continue;
    const crosses = a.y > p.y !== b.y > p.y;
    if (crosses && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Ikki kesma kesishadimi (uchlari hisobga olinmaydi). */
export function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const ab = sub(b, a);
  const cd = sub(d, c);
  const denominator = cross(ab, cd);
  if (Math.abs(denominator) < 1e-9) return false;
  const ac = sub(c, a);
  const t = cross(ac, cd) / denominator;
  const u = cross(ac, ab) / denominator;
  const eps = 1e-6;
  return t > eps && t < 1 - eps && u > eps && u < 1 - eps;
}
