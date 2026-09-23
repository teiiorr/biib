export interface ZardoziGeometry {
  readonly height: number;
  /** Parallel oltin iplar y koordinatalari. */
  readonly rows: readonly number[];
  /** Har 6 px da bitta koʻndalang bosma chok (bir katak). */
  readonly stitch: string;
  readonly pitch: number;
}

/**
 * Buxoro zardoʻzligi: 2–3 ta yotqizilgan oltin ip, ustidan har 6 px da ingichka koʻndalang
 * bosma chok (Met 21.114.3 koʻrpachasi). Ip oraligʻi 2 px, chok iplardan 0.5 px chiqadi.
 */
export function zardoziGeometry(lines: 2 | 3, pitch = 6): ZardoziGeometry {
  const spacing = 2;
  const height = lines * spacing + 1;
  const rows = Array.from({ length: lines }, (_, i) => 1.5 + i * spacing);
  const stitch = `M${pitch / 2} 0.5 V${height - 0.5}`;
  return { height, rows, stitch, pitch };
}
