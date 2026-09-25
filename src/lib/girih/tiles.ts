import { polar, type Point } from "@/lib/ornament/geometry";

export type TileKind =
  "decagon" | "pentagon" | "hexagon" | "bowtie" | "rhombus" | "octagon" | "square";

/** Uchlari ccw tartibda, hamma qirralari bir xil uzunlikda (girih qoidasi). */
export interface Tile {
  readonly kind: TileKind;
  readonly vertices: readonly Point[];
}

/** Muntazam koʻpburchak: qirra uzunligi berilgan, birinchi uch startDeg burchakda. */
export function regularPolygon(
  sides: number,
  edge: number,
  center: Point,
  startDeg: number,
): Point[] {
  const radius = edge / (2 * Math.sin(Math.PI / sides));
  return Array.from({ length: sides }, (_, i) =>
    polar(center, radius, startDeg + (360 / sides) * i),
  );
}

/** Dekagon, uchi yuqorida (uchlar 18° + 36°k): qatorda vertikal qirralar bilan tutashadi. */
export function decagonTile(center: Point, edge: number, rotationDeg = 18): Tile {
  return { kind: "decagon", vertices: regularPolygon(10, edge, center, rotationDeg) };
}

export function pentagonTile(center: Point, edge: number, rotationDeg: number): Tile {
  return { kind: "pentagon", vertices: regularPolygon(5, edge, center, rotationDeg) };
}

export function octagonTile(center: Point, edge: number, rotationDeg = 22.5): Tile {
  return { kind: "octagon", vertices: regularPolygon(8, edge, center, rotationDeg) };
}

/** Kvadrat, uchlari oʻqlarda (romb holati): 4.8.8 toʻrida oktagonlar orasiga tushadi. */
export function squareTile(center: Point, edge: number, rotationDeg = 0): Tile {
  return { kind: "square", vertices: regularPolygon(4, edge, center, rotationDeg) };
}
