import { dist, lerp, pointKey, polylinePath, type Point } from "@/lib/ornament/geometry";
import type { Link, LinkEnd } from "./hankin";

export interface InterlaceGap {
  readonly x: number;
  readonly y: number;
  /** Ostdan oʻtayotgan tasma yoʻnalishi, gradus. */
  readonly angle: number;
}

export interface StrandSet {
  readonly strands: string[];
  readonly interlaceGaps: readonly InterlaceGap[];
}

interface Walk {
  readonly points: Point[];
  /** Har qirra oʻrtasi (kesishma) uchun points ichidagi indeks va ishorasi. */
  readonly crossings: { index: number; sign: 1 | -1 }[];
  readonly closed: boolean;
}

function endKey(end: LinkEnd): string {
  return `${pointKey(end.midpoint)}|${end.sign}`;
}

/**
 * Plitka boʻlaklarini uzluksiz tasmalarga ulaydi. Qirra oʻrtasida ikki plitkaning
 * + nurlari bir chiziqda, − nurlari ham; har boʻlak + dan − ga boradi, shuning uchun
 * bir tasma boʻylab kesishmalar ust/ost navbatlashadi: + ust, − ost (Tait qoidasi,
 * yuzlar shaxmat tartibida: yulduz/uch atrofi).
 */
export function assembleStrands(links: readonly Link[], gap: number): StrandSet {
  const byEnd = new Map<string, number[]>();
  links.forEach((link, i) => {
    for (const end of [link.from, link.to]) {
      const key = endKey(end);
      const list = byEnd.get(key) ?? [];
      list.push(i);
      byEnd.set(key, list);
    }
  });

  const visited = new Set<number>();
  const walks: Walk[] = [];

  for (let start = 0; start < links.length; start += 1) {
    if (visited.has(start)) continue;
    const forward = walk(links, byEnd, visited, start, "to");
    if (forward.closed) {
      walks.push(forward);
      continue;
    }
    const startLink = links[start];
    const previous = startLink
      ? (byEnd.get(endKey(startLink.from)) ?? []).find((i) => i !== start && !visited.has(i))
      : undefined;
    const previousLink = previous === undefined ? undefined : links[previous];
    if (previous === undefined || !previousLink || !startLink) {
      walks.push(forward);
      continue;
    }
    // Orqaga yurish qoʻshni boʻlakdan boshlanadi; ulanish nuqtasi uning qaysi uchida boʻlsa, yoʻnalish shunga koʻra.
    const backwardDir = endKey(previousLink.to) === endKey(startLink.from) ? "from" : "to";
    const backward = walk(links, byEnd, visited, previous, backwardDir);
    walks.push(joinWalks(backward, forward));
  }

  const strands: string[] = [];
  const interlaceGaps: InterlaceGap[] = [];
  for (const w of walks) {
    const pieces = splitAtUnderCrossings(w, gap, interlaceGaps);
    for (const piece of pieces) if (piece.length > 1) strands.push(polylinePath(piece));
  }
  return { strands, interlaceGaps };
}

function walk(
  links: readonly Link[],
  byEnd: Map<string, number[]>,
  visited: Set<number>,
  start: number,
  direction: "to" | "from",
): Walk {
  const points: Point[] = [];
  const crossings: Walk["crossings"] = [];
  let current = start;
  let dir = direction;
  let closed = false;
  for (let guard = 0; guard < links.length + 1; guard += 1) {
    const link = links[current];
    if (!link) break;
    visited.add(current);
    const ordered = dir === "to" ? [...link.points] : [...link.points].reverse();
    const head = dir === "to" ? link.from : link.to;
    const tail = dir === "to" ? link.to : link.from;
    if (points.length === 0) {
      crossings.push({ index: 0, sign: head.sign });
      points.push(...ordered);
    } else {
      points.push(...ordered.slice(1));
    }
    crossings.push({ index: points.length - 1, sign: tail.sign });
    const next = (byEnd.get(endKey(tail)) ?? []).find((i) => i !== current);
    if (next === undefined) break;
    if (next === start) {
      closed = true;
      break;
    }
    if (visited.has(next)) break;
    const nextLink = links[next];
    if (!nextLink) break;
    dir = endKey(nextLink.from) === endKey(tail) ? "to" : "from";
    current = next;
  }
  return { points, crossings, closed };
}

function joinWalks(backward: Walk, forward: Walk): Walk {
  const reversedPoints = [...backward.points].reverse();
  const last = reversedPoints.length - 1;
  const reversedCrossings = backward.crossings
    .map((c) => ({ index: last - c.index, sign: c.sign }))
    .reverse();
  const points = [...reversedPoints, ...forward.points.slice(1)];
  const crossings = [
    ...reversedCrossings,
    ...forward.crossings.slice(1).map((c) => ({ index: c.index + last, sign: c.sign })),
  ];
  return { points, crossings, closed: false };
}

/** Ost kesishmada tasma uziladi: ikki tomondan gap uzunlikda joy qoldiriladi. */
function splitAtUnderCrossings(w: Walk, gap: number, gaps: InterlaceGap[]): Point[][] {
  const pieces: Point[][] = [];
  let piece: Point[] = [];
  const under = new Map<number, true>();
  for (const c of w.crossings) {
    const interior = c.index > 0 && c.index < w.points.length - 1;
    if (c.sign === -1 && (interior || w.closed)) under.set(c.index, true);
  }
  for (let i = 0; i < w.points.length; i += 1) {
    const p = w.points[i];
    if (!p) continue;
    if (!under.has(i)) {
      piece.push(p);
      continue;
    }
    const prev = w.points[i - 1] ?? w.points[w.points.length - 2];
    const next = w.points[i + 1] ?? w.points[1];
    if (prev) piece.push(shorten(p, prev, gap));
    // Yopiq halqada bosh va oxir bitta kesishma: boʻshliq bir marta yoziladi.
    if (next && !(w.closed && i === w.points.length - 1)) {
      gaps.push({
        x: p.x,
        y: p.y,
        angle: (Math.atan2(next.y - p.y, next.x - p.x) * 180) / Math.PI,
      });
    }
    pieces.push(piece);
    piece = next ? [shorten(p, next, gap)] : [];
  }
  pieces.push(piece);
  // Yopiq halqa boshi ost kesishma boʻlsa, boshi va oxiri bitta boʻlak: qoʻshib yuboriladi.
  if (w.closed && pieces.length > 1 && !under.has(0)) {
    const first = pieces.shift() ?? [];
    const lastPiece = pieces.pop() ?? [];
    pieces.push([...lastPiece, ...first.slice(1)]);
  }
  return pieces;
}

function shorten(from: Point, toward: Point, gap: number): Point {
  const d = dist(from, toward);
  const t = d === 0 ? 0 : Math.min(gap / d, 0.45);
  return lerp(from, toward, t);
}
