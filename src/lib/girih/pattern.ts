import { hankinLinks, type Link } from "./hankin";
import { assembleStrands, type InterlaceGap } from "./strands";
import type { Tile } from "./tiles";
import {
  contactAngle,
  DECAGON_RADIUS,
  eightfoldTiles,
  OCTAGON_RADIUS,
  periodFor,
  tenfoldTiles,
  type GirihSymmetry,
} from "./tiling";

export interface GirihPatternOptions {
  readonly symmetry: GirihSymmetry;
  readonly width: number;
  readonly height: number;
  /** Asosiy yulduz (dekagon yoki oktagon) diametri, px. */
  readonly cell: number;
  /** Kesishmadagi ust-ost boʻshligʻi, px (chiziq qalinligi 1 px uchun 2–3). */
  readonly gap?: number;
}

export interface GirihPattern {
  readonly width: number;
  readonly height: number;
  /** SVG path d: har biri uzluksiz tasma boʻlagi. */
  readonly strands: string[];
  readonly interlaceGaps: readonly InterlaceGap[];
  /** Plitka konturlari (xira fon uchun ixtiyoriy). */
  readonly outlines: string[];
  /** Davr oʻlchami px da: SVG <pattern> uchun. */
  readonly period: { readonly width: number; readonly height: number };
}

/** Qirra uzunligi px: cell = aylana diametri. */
export function edgeFor(symmetry: GirihSymmetry, cell: number): number {
  return cell / (2 * (symmetry === 10 ? DECAGON_RADIUS : OCTAGON_RADIUS));
}

function scaleTile(tile: Tile, k: number, dx: number, dy: number): Tile {
  return {
    kind: tile.kind,
    vertices: tile.vertices.map((p) => ({ x: p.x * k + dx, y: p.y * k + dy })),
  };
}

function outlinePath(tile: Tile): string {
  return (
    tile.vertices.map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`).join(" ") +
    " Z"
  );
}

function round(n: number): string {
  const r = Math.round(n * 10) / 10;
  return String(Object.is(r, -0) ? 0 : r);
}

function tilesCovering(
  symmetry: GirihSymmetry,
  width: number,
  height: number,
  edge: number,
): Tile[] {
  const period = periodFor(symmetry);
  const pw = period.width * edge;
  const ph = (symmetry === 10 ? period.height / 2 : period.height) * edge;
  const cols: [number, number] = [-1, Math.ceil(width / pw)];
  const rows: [number, number] = [-1, Math.ceil(height / ph)];
  const unit = symmetry === 10 ? tenfoldTiles(cols, rows) : eightfoldTiles(cols, rows);
  const margin = 2 * edge;
  return unit
    .map((t) => scaleTile(t, edge, 0, 0))
    .filter((t) =>
      t.vertices.some(
        (p) => p.x > -margin && p.x < width + margin && p.y > -margin && p.y < height + margin,
      ),
    );
}

/**
 * Tayyor naqsh: plitkalar → Hankin boʻlaklari → tasmalar. Chiqish deterministik,
 * SSR va mijozda bir xil satrlar.
 */
export function girihPattern(options: GirihPatternOptions): GirihPattern {
  const { symmetry, width, height, cell } = options;
  const edge = edgeFor(symmetry, cell);
  const gap = options.gap ?? Math.max(1.5, edge * 0.08);
  const tiles = tilesCovering(symmetry, width, height, edge);
  const links: Link[] = tiles.flatMap((t) => hankinLinks(t.vertices, contactAngle(symmetry)));
  const { strands, interlaceGaps } = assembleStrands(links, gap);
  const period = periodFor(symmetry);
  return {
    width,
    height,
    strands,
    interlaceGaps,
    outlines: tiles.map(outlinePath),
    period: { width: period.width * edge, height: period.height * edge },
  };
}

/**
 * Bitta davr: SVG <pattern> ichida takrorlash uchun. Qoʻshni davrlar ham hisoblanadi,
 * davr chegarasida tasmalar uzilmasin deb; <pattern> oʻzi qirqadi.
 */
export function girihPeriod(symmetry: GirihSymmetry, cell: number, gap?: number): GirihPattern {
  const edge = edgeFor(symmetry, cell);
  const period = periodFor(symmetry);
  const pw = period.width * edge;
  const ph = period.height * edge;
  const full = girihPattern({
    symmetry,
    width: pw * 3,
    height: ph * 3,
    cell,
    ...(gap === undefined ? {} : { gap }),
  });
  const shift = (d: string): string => translatePath(d, -pw, -ph);
  return {
    width: pw,
    height: ph,
    strands: full.strands.filter((d) => touches(d, pw, ph, pw, ph)).map(shift),
    interlaceGaps: full.interlaceGaps
      .filter((g) => g.x >= pw && g.x <= 2 * pw && g.y >= ph && g.y <= 2 * ph)
      .map((g) => ({ ...g, x: g.x - pw, y: g.y - ph })),
    outlines: full.outlines.filter((d) => touches(d, pw, ph, pw, ph)).map(shift),
    period: { width: pw, height: ph },
  };
}

const NUMBER = /-?\d+(?:\.\d+)?/g;

function touches(d: string, x: number, y: number, w: number, h: number): boolean {
  const numbers = d.match(NUMBER)?.map(Number) ?? [];
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    const px = numbers[i] ?? 0;
    const py = numbers[i + 1] ?? 0;
    if (px >= x - 1 && px <= x + w + 1 && py >= y - 1 && py <= y + h + 1) return true;
  }
  return false;
}

function translatePath(d: string, dx: number, dy: number): string {
  let index = 0;
  return d.replace(NUMBER, (m) => {
    const v = Number(m) + (index % 2 === 0 ? dx : dy);
    index += 1;
    return round(v);
  });
}
