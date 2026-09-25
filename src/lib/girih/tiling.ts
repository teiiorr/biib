import { decagonTile, octagonTile, type Tile } from "./tiles";

export type GirihSymmetry = 10 | 8;

/** Dekagonning aylana radiusi (qirra = 1): oltin nisbat. */
export const DECAGON_RADIUS = 1 / (2 * Math.sin(Math.PI / 10));
export const OCTAGON_RADIUS = 1 / (2 * Math.sin(Math.PI / 8));

export function contactAngle(symmetry: GirihSymmetry): number {
  return symmetry === 10 ? 72 : 45;
}

/** Yulduz medalyoni uchun bitta markaziy plitka: qirra uzunligi 1, markaz (0,0). */
export function centralTile(symmetry: GirihSymmetry): Tile {
  return symmetry === 10 ? decagonTile({ x: 0, y: 0 }, 1) : octagonTile({ x: 0, y: 0 }, 1);
}
