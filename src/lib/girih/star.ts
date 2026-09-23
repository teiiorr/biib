import { polar, type Point } from "@/lib/ornament/geometry";
import { hankinLinks } from "./hankin";
import { assembleStrands, type InterlaceGap } from "./strands";
import { pentagonTile, squareTile, type Tile } from "./tiles";
import {
  centralTile,
  contactAngle,
  DECAGON_RADIUS,
  OCTAGON_RADIUS,
  type GirihSymmetry,
} from "./tiling";

export interface GirihStar {
  readonly size: number;
  readonly strands: string[];
  readonly interlaceGaps: readonly InterlaceGap[];
  readonly outline: string;
}

export interface GirihStarOptions {
  /** Markaziy plitka atrofidagi halqa: 10 → oʻn beshburchak, 8 → toʻrt romb (4.8.8 qoʻshnilari). */
  readonly ring?: boolean;
  readonly gap?: number;
}

/**
 * Bitta yulduz medalyoni. 10 karrali: dekagon + 10 beshburchak (144° + 108° + 108° = 360°,
 * halqa aniq yopiladi). 8 karrali: oktagon + diagonal qirralardagi 4 kvadrat.
 * `size` — medalyonning butun kengligi, px.
 */
export function girihStar(
  symmetry: GirihSymmetry,
  size: number,
  options: GirihStarOptions = {},
): GirihStar {
  const ring = options.ring ?? true;
  const center = centralTile(symmetry);
  const tiles: Tile[] = [center];
  if (ring) tiles.push(...ringTiles(symmetry, center));

  const radius = Math.max(...tiles.flatMap((t) => t.vertices.map((p) => Math.hypot(p.x, p.y))));
  const k = size / (2 * radius);
  const scaled = tiles.map((t) => ({
    kind: t.kind,
    vertices: t.vertices.map((p) => ({ x: p.x * k + size / 2, y: p.y * k + size / 2 })),
  }));
  const edge = k;
  const gap = options.gap ?? Math.max(1.2, edge * 0.08);
  const links = scaled.flatMap((t) => hankinLinks(t.vertices, contactAngle(symmetry)));
  const { strands, interlaceGaps } = assembleStrands(links, gap);
  const outline = scaled[0]
    ? scaled[0].vertices
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ") + " Z"
    : "";
  return { size, strands, interlaceGaps, outline };
}

function ringTiles(symmetry: GirihSymmetry, center: Tile): Tile[] {
  const out: Tile[] = [];
  const n = center.vertices.length;
  for (let i = 0; i < n; i += 1) {
    const a = center.vertices[i];
    const b = center.vertices[(i + 1) % n];
    if (!a || !b) continue;
    if (symmetry === 8 && i % 2 === 0) continue;
    const mid: Point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const outward = Math.atan2(mid.y, mid.x) * (180 / Math.PI);
    if (symmetry === 10) {
      // Markazlar orasi: dekagon apotemasi + beshburchak apotemasi; bir uch tashqariga qarasa, qarshi qirra dekagonga yopishadi.
      const apothem = 1 / (2 * Math.tan(Math.PI / 5));
      const c = polar({ x: 0, y: 0 }, DECAGON_RADIUS * Math.cos(Math.PI / 10) + apothem, outward);
      out.push(pentagonTile(c, 1, outward));
    } else {
      // Kvadrat apotemasi 0.5; uchlar outward ± 45° da boʻlsa, bir qirra oktagon qirrasiga tushadi.
      const c = polar({ x: 0, y: 0 }, OCTAGON_RADIUS * Math.cos(Math.PI / 8) + 0.5, outward);
      out.push(squareTile(c, 1, outward + 45));
    }
  }
  return out;
}
