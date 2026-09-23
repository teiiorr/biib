import {
  add,
  cross,
  dist,
  dot,
  lerp,
  normalize,
  perp,
  pointInPolygon,
  scale,
  segmentsIntersect,
  signedArea,
  sub,
  type Point,
} from "@/lib/ornament/geometry";

export type RaySign = 1 | -1;

export interface LinkEnd {
  readonly midpoint: Point;
  readonly sign: RaySign;
}

/** Bir plitka ichidagi tasma boʻlagi: qirra oʻrtasidan sinish nuqtasi orqali boshqa qirra oʻrtasigacha. */
export interface Link {
  readonly from: LinkEnd;
  readonly to: LinkEnd;
  readonly points: readonly Point[];
}

interface Ray {
  readonly edge: number;
  readonly origin: Point;
  readonly direction: Point;
}

const EPS = 1e-7;

/**
 * Kaplan (2005) «polygons in contact» / Hankin usuli: har qirra oʻrtasidan ichkariga,
 * qirraga contactDeg burchak ostida ikki nur chiqadi (+ oldinga, − orqaga).
 * Har + nur eng yaqin − nur bilan uchrashadi; kesishma plitka ichida boʻlishi shart.
 * Girih plitkalarida contactDeg = 72 (Lu–Steinhardt), 8 karrali toʻrda 45.
 */
export function hankinLinks(polygon: readonly Point[], contactDeg: number): Link[] {
  const vertices = signedArea(polygon) < 0 ? [...polygon].reverse() : [...polygon];
  const n = vertices.length;
  const theta = (contactDeg * Math.PI) / 180;
  const plus: Ray[] = [];
  const minus: Ray[] = [];

  for (let i = 0; i < n; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    if (!a || !b) continue;
    const e = normalize(sub(b, a));
    const inward = perp(e);
    const origin = lerp(a, b, 0.5);
    plus.push({
      edge: i,
      origin,
      direction: add(scale(e, Math.cos(theta)), scale(inward, Math.sin(theta))),
    });
    minus.push({
      edge: i,
      origin,
      direction: add(scale(e, -Math.cos(theta)), scale(inward, Math.sin(theta))),
    });
  }

  const candidates = plus.map((ray) =>
    minus.map((partner) => {
      if (partner.edge === ray.edge) return null;
      const hit = meet(ray, partner);
      if (!hit || !insideAndClear(hit.point, ray, partner, vertices)) return null;
      return { point: hit.point, cost: hit.t + hit.s };
    }),
  );
  const matching = shortestMatching(candidates);

  const links: Link[] = [];
  matching.forEach((j, i) => {
    const ray = plus[i];
    const partner = j === undefined ? undefined : minus[j];
    const chosen = j === undefined ? undefined : candidates[i]?.[j];
    if (!ray || !partner || !chosen) return;
    const straight = Math.abs(cross(ray.direction, partner.direction)) < 1e-6;
    links.push({
      from: { midpoint: ray.origin, sign: 1 },
      to: { midpoint: partner.origin, sign: -1 },
      points: straight ? [ray.origin, partner.origin] : [ray.origin, chosen.point, partner.origin],
    });
  });
  return links;
}

type Candidate = { readonly point: Point; readonly cost: number } | null;

/**
 * Kaplan: nurlar juftligi umumiy uzunligi eng kichik boʻladigan qilib tanlanadi (bitmask DP,
 * n ≤ 10). Har − nur bir marta ishlatiladi; juftsiz qolgan + nur chizilmaydi.
 */
function shortestMatching(candidates: readonly (readonly Candidate[])[]): (number | undefined)[] {
  const n = candidates.length;
  const states = 1 << n;
  const best = new Float64Array(states).fill(Number.POSITIVE_INFINITY);
  const parent = new Int16Array(states).fill(-1);
  best[0] = 0;
  const popcount = (m: number): number => {
    let c = 0;
    for (let v = m; v > 0; v >>= 1) c += v & 1;
    return c;
  };
  for (let mask = 0; mask < states; mask += 1) {
    const cost = best[mask] ?? Number.POSITIVE_INFINITY;
    if (!Number.isFinite(cost)) continue;
    const i = popcount(mask);
    if (i >= n) continue;
    const row = candidates[i] ?? [];
    for (let j = 0; j < n; j += 1) {
      const c = row[j];
      if (!c || mask & (1 << j)) continue;
      const next = mask | (1 << j);
      if (cost + c.cost < (best[next] ?? Number.POSITIVE_INFINITY)) {
        best[next] = cost + c.cost;
        parent[next] = j;
      }
    }
  }
  const full = states - 1;
  if (Number.isFinite(best[full] ?? Number.POSITIVE_INFINITY)) {
    const result: (number | undefined)[] = new Array<number | undefined>(n).fill(undefined);
    let mask = full;
    for (let i = n - 1; i >= 0; i -= 1) {
      const j = parent[mask] ?? -1;
      if (j < 0) break;
      result[i] = j;
      mask &= ~(1 << j);
    }
    return result;
  }
  // Toʻliq juftlash boʻlmasa (nomuntazam plitka): har nur uchun eng yaqin boʻsh sherik.
  const used = new Set<number>();
  return candidates.map((row) => {
    let pick: number | undefined;
    row.forEach((c, j) => {
      if (!c || used.has(j)) return;
      const current = pick === undefined ? undefined : row[pick];
      if (!current || c.cost < current.cost) pick = j;
    });
    if (pick !== undefined) used.add(pick);
    return pick;
  });
}

function meet(a: Ray, b: Ray): { point: Point; t: number; s: number } | null {
  const denominator = cross(a.direction, b.direction);
  const offset = sub(b.origin, a.origin);
  if (Math.abs(denominator) < 1e-9) {
    // Nurlar bir chiziqda va bir-biriga qarab: tasma toʻgʻri oʻtadi (kvadrat 45°, bogʻich beli).
    const collinear = Math.abs(cross(a.direction, offset)) < 1e-6;
    const facing = dot(a.direction, offset) > EPS && dot(b.direction, offset) < -EPS;
    if (!collinear || !facing) return null;
    const half = dist(a.origin, b.origin) / 2;
    return { point: lerp(a.origin, b.origin, 0.5), t: half, s: half };
  }
  const t = cross(offset, b.direction) / denominator;
  const s = cross(offset, a.direction) / denominator;
  if (t <= EPS || s <= EPS) return null;
  return { point: add(a.origin, scale(a.direction, t)), t, s };
}

/** Botiq plitkalarda (bogʻich) nur avval tashqariga chiqib ketishi mumkin: kesma qirralarni kesmasin. */
function insideAndClear(p: Point, a: Ray, b: Ray, vertices: readonly Point[]): boolean {
  if (!pointInPolygon(p, vertices)) return false;
  const n = vertices.length;
  for (let i = 0; i < n; i += 1) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % n];
    if (!v1 || !v2) continue;
    if (i !== a.edge && segmentsIntersect(a.origin, p, v1, v2)) return false;
    if (i !== b.edge && segmentsIntersect(b.origin, p, v1, v2)) return false;
  }
  return true;
}
