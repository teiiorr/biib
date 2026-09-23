import type { Point } from "@/lib/ornament/geometry";
import {
  bowtieTile,
  decagonTile,
  elongatedHexagonTile,
  octagonTile,
  squareTile,
  type Tile,
} from "./tiles";

export type GirihSymmetry = 10 | 8;

export interface Period {
  readonly width: number;
  readonly height: number;
}

const SIN36 = Math.sin((36 * Math.PI) / 180);
const COS36 = Math.cos((36 * Math.PI) / 180);
const COS18 = Math.cos((18 * Math.PI) / 180);
const SIN18 = Math.sin((18 * Math.PI) / 180);

/** Dekagonning aylana radiusi (qirra = 1): oltin nisbat. */
export const DECAGON_RADIUS = 1 / (2 * Math.sin(Math.PI / 10));
export const OCTAGON_RADIUS = 1 / (2 * Math.sin(Math.PI / 8));

/**
 * 10 karrali davriy toʻr: dekagon, choʻzinchoq oltiburchak va ikki bogʻich (Lu–Steinhardt 2007,
 * 2-rasm turidagi davriy naqsh). Qatorda dekagon–oltiburchak almashadi, keyingi qator yarim
 * davrga siljiydi; bogʻichlar oltiburchak ustidagi ikki boʻshliqni toʻldiradi.
 * Bir davr maydoni = dekagon + oltiburchak + 2 bogʻich (tekshirilgan).
 */
export function tenfoldPeriod(): Period {
  return {
    width: 2 * DECAGON_RADIUS * COS18 + 2 * SIN36,
    height: 2 * (DECAGON_RADIUS + 0.5 + COS36),
  };
}

export function tenfoldTiles(columns: [number, number], rows: [number, number]): Tile[] {
  const px = tenfoldPeriod().width;
  const py = tenfoldPeriod().height / 2;
  const r = DECAGON_RADIUS;
  const tiles: Tile[] = [];
  for (let j = rows[0]; j <= rows[1]; j += 1) {
    const shift = ((j % 2) + 2) % 2 === 0 ? 0 : px / 2;
    for (let i = columns[0]; i <= columns[1]; i += 1) {
      const a: Point = { x: i * px + shift, y: j * py };
      const h: Point = { x: a.x + px / 2, y: a.y };
      tiles.push(decagonTile(a, 1));
      tiles.push(elongatedHexagonTile(h, 1));
      // Bogʻich markazi oltiburchak markazidan: uchlari — oltiburchak tepasi va oʻng yuqori uchi,
      // oʻng dekagonning 126°/90°, yuqori dekagonning 342°/306° uchlari; oʻrtacha qiymat yopiq shaklda.
      const cx = (SIN36 + r * COS18) / 2;
      const cy = (1.5 + 2 * COS36 + r + 2 * py - r * SIN18 - r * COS36) / 6;
      tiles.push(bowtieTile({ x: h.x + cx, y: h.y + cy }, 1, 36));
      tiles.push(bowtieTile({ x: h.x - cx, y: h.y + cy }, 1, -36));
    }
  }
  return tiles;
}

/**
 * 8 karrali toʻr: 4.8.8 (oktagon + kvadrat), Bibi-Xonim va Ulugʻbek madrasasi panellaridagi
 * bir-biriga kirgan sakkiz qirrali yulduzlar skeleti (Sakkal 2018). Oktagonlar kvadrat panjarada,
 * romb holatidagi kvadratlar diagonal qirralarga yopishadi.
 */
export function eightfoldPeriod(): Period {
  const side = 1 + Math.SQRT2;
  return { width: side, height: side };
}

export function eightfoldTiles(columns: [number, number], rows: [number, number]): Tile[] {
  const p = eightfoldPeriod().width;
  const tiles: Tile[] = [];
  for (let j = rows[0]; j <= rows[1]; j += 1) {
    for (let i = columns[0]; i <= columns[1]; i += 1) {
      tiles.push(octagonTile({ x: i * p, y: j * p }, 1));
      tiles.push(squareTile({ x: i * p + p / 2, y: j * p + p / 2 }, 1));
    }
  }
  return tiles;
}

export function periodFor(symmetry: GirihSymmetry): Period {
  return symmetry === 10 ? tenfoldPeriod() : eightfoldPeriod();
}

export function contactAngle(symmetry: GirihSymmetry): number {
  return symmetry === 10 ? 72 : 45;
}

/** Yulduz medalyoni uchun bitta markaziy plitka: qirra uzunligi 1, markaz (0,0). */
export function centralTile(symmetry: GirihSymmetry): Tile {
  return symmetry === 10 ? decagonTile({ x: 0, y: 0 }, 1) : octagonTile({ x: 0, y: 0 }, 1);
}
