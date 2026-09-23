import { fmt, polar, type Point } from "./geometry";
import { createRng } from "./seed";

export interface PalakGeometry {
  readonly size: number;
  readonly center: Point;
  /** Tashqi nuqtali halqa radiusi. */
  readonly radius: number;
  /** Zanjir chok halqalari (kichik ellipslar) — ichki halqa. */
  readonly loops: readonly string[];
  /** Boʻshliqli tashqi yoy: boʻshliqdan boshlanib boʻshliqda tugaydi. */
  readonly ringPath: string;
  /** Nuqta qadamı (stroke-dasharray uchun). */
  readonly pitch: number;
  /** Boʻshliq markazi va uning burchagi. */
  readonly gap: Point;
  readonly gapAngle: number;
}

/**
 * Toshkent palagining oy medalyoni: tashqi nuqtali halqa (yoʻrma chok), ichida zanjir chok
 * halqasi (Met 07.72 Nurota soʻzanasidagi chok uslubi). Bitta ataylab qoldirilgan boʻshliq —
 * kashtachilar anʼanasi. Boʻshliq oʻrni urugʻdan: server va mijozda bir xil.
 */
export function palakGeometry(size: number, seed = "palak"): PalakGeometry {
  const rng = createRng(seed);
  const center = { x: size / 2, y: size / 2 };
  const radius = size * 0.44;
  const pitch = Math.max(4, size / 28);
  // Boʻshliq yuqori-oʻng chorakda: koʻz darajasida, lekin oʻqishga xalaqit bermaydi.
  const gapAngle = -70 + rng() * 40;
  const gapHalf = ((pitch * 2) / (2 * Math.PI * radius)) * 360;
  const start = polar(center, radius, gapAngle + gapHalf);
  const end = polar(center, radius, gapAngle - gapHalf);
  const ringPath = `M${fmt(start.x)} ${fmt(start.y)} A${fmt(radius)} ${fmt(radius)} 0 1 1 ${fmt(end.x)} ${fmt(end.y)}`;

  const innerRadius = radius - pitch * 1.6;
  const count = Math.max(12, Math.round((2 * Math.PI * innerRadius) / (pitch * 1.15)));
  const loops: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (360 / count) * i;
    const delta = Math.abs(((((angle - gapAngle) % 360) + 540) % 360) - 180);
    if (delta < gapHalf * 1.4) continue;
    loops.push(chainLoop(polar(center, innerRadius, angle), angle, pitch * 0.5, pitch * 0.28));
  }
  return {
    size,
    center,
    radius,
    loops,
    ringPath,
    pitch,
    gap: polar(center, radius, gapAngle),
    gapAngle,
  };
}

/** Zanjir chok koʻzi: halqaga urinma boʻylab choʻzilgan kichik ellips. */
function chainLoop(at: Point, angleDeg: number, rx: number, ry: number): string {
  const tangent = angleDeg + 90;
  const a = polar(at, rx, tangent);
  const b = polar(at, rx, tangent + 180);
  return `M${fmt(a.x)} ${fmt(a.y)} A${fmt(rx)} ${fmt(ry)} ${fmt(tangent)} 0 1 ${fmt(b.x)} ${fmt(b.y)} A${fmt(rx)} ${fmt(ry)} ${fmt(tangent)} 0 1 ${fmt(a.x)} ${fmt(a.y)}`;
}
