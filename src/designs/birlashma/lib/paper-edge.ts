import { seeded } from "./seed";

export type EdgeKind = "deckle" | "torn";

/**
 * Qoʻlda qirqilgan qogʻoz cheti: foizda beriladi, 300–700 px varaqda deckle 0.5–1.5 px, torn 2–6 px chiqadi.
 * Koordinatalar 0..100 (viewBox), preserveAspectRatio="none" bilan cho'ziladi.
 */
export function paperEdgePath(seed: number, kind: EdgeKind = "deckle", segments = 28): string {
  const rnd = seeded(seed);
  const amp = kind === "torn" ? 1.4 : 0.22;
  const pts: string[] = [];
  const jitter = () => (rnd() - 0.5) * 2 * amp;
  for (let i = 0; i <= segments; i++) pts.push(`${(i / segments) * 100} ${0.5 + jitter()}`);
  for (let i = 1; i <= segments; i++) pts.push(`${99.5 + jitter()} ${(i / segments) * 100}`);
  for (let i = segments - 1; i >= 0; i--) pts.push(`${(i / segments) * 100} ${99.5 + jitter()}`);
  for (let i = segments - 1; i >= 1; i--) pts.push(`${0.5 + jitter()} ${(i / segments) * 100}`);
  return `M${pts.join("L")}Z`;
}

export function paperEdgeDataUri(seed: number, kind: EdgeKind = "deckle"): string {
  const d = paperEdgePath(seed, kind);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${d}' fill='black'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
