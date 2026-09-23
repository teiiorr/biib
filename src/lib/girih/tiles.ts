import { polar, signedArea, type Point } from "@/lib/ornament/geometry";

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

function ccw(points: readonly Point[]): Point[] {
  return signedArea(points) < 0 ? [...points].reverse() : [...points];
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

/**
 * Choʻzinchoq oltiburchak (72°,144°,144°,72°,144°,144°), uchlari ±y da,
 * yon qirralari vertikal: dekagonning vertikal qirrasiga yopishadi.
 */
export function elongatedHexagonTile(center: Point, edge: number, rotationDeg = 0): Tile {
  const half = edge / 2;
  const side = edge * Math.sin((36 * Math.PI) / 180);
  const tip = half + edge * Math.cos((36 * Math.PI) / 180);
  const base: Point[] = [
    { x: 0, y: -tip },
    { x: side, y: -half },
    { x: side, y: half },
    { x: 0, y: tip },
    { x: -side, y: half },
    { x: -side, y: -half },
  ];
  return { kind: "hexagon", vertices: placeShape(base, center, rotationDeg) };
}

/**
 * Bogʻich (72°,216°,72°,72°,216°,72°): ikki vertikal yon, belida ikki botiq uch.
 * Yuqori bel uchlari yon uchlaridan pastda: 1 - sin 18°.
 */
export function bowtieTile(center: Point, edge: number, rotationDeg = 0): Tile {
  const w = edge * Math.cos((18 * Math.PI) / 180);
  const pinch = edge * Math.sin((18 * Math.PI) / 180);
  const half = edge / 2;
  const base: Point[] = [
    { x: -w, y: -half },
    { x: 0, y: -half + pinch },
    { x: w, y: -half },
    { x: w, y: half },
    { x: 0, y: half - pinch },
    { x: -w, y: half },
  ];
  return { kind: "bowtie", vertices: placeShape(base, center, rotationDeg) };
}

/** Romb (72°/108°), oʻtkir uchlari ±x da. */
export function rhombusTile(center: Point, edge: number, rotationDeg = 0): Tile {
  const dx = edge * Math.cos((36 * Math.PI) / 180);
  const dy = edge * Math.sin((36 * Math.PI) / 180);
  const base: Point[] = [
    { x: -dx, y: 0 },
    { x: 0, y: -dy },
    { x: dx, y: 0 },
    { x: 0, y: dy },
  ];
  return { kind: "rhombus", vertices: placeShape(base, center, rotationDeg) };
}

function placeShape(base: readonly Point[], center: Point, rotationDeg: number): Point[] {
  const c = Math.cos((rotationDeg * Math.PI) / 180);
  const s = Math.sin((rotationDeg * Math.PI) / 180);
  return ccw(
    base.map((p) => ({ x: center.x + p.x * c - p.y * s, y: center.y + p.x * s + p.y * c })),
  );
}
