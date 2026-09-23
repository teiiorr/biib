import type { Finding } from "./types";

export interface AlignmentOptions {
  readonly gridItem: string;
  readonly container: string;
  readonly tolerance: number;
}

/** Brauzer ichida ishlaydi: chetlar :root dagi --columns/--margin/--gutter/--content-max dan hisoblanadi. */
export function auditAlignment(opts: AlignmentOptions): Finding[] {
  const findings: Finding[] = [];
  const label = (el: Element): string => {
    const id = el.id ? `#${el.id}` : "";
    const testId = el.getAttribute("data-testid");
    const cls = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("");
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${id}${tid}${cls}${text ? ` “${text}”` : ""}`;
  };
  const px = (value: string, fallback: number): number => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  };
  const visible = (el: Element): boolean => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const rootStyle = getComputedStyle(document.documentElement);
  const columns = Math.max(1, Math.round(px(rootStyle.getPropertyValue("--columns"), 4)));
  const margin = px(rootStyle.getPropertyValue("--margin"), 16);
  const gutter = px(rootStyle.getPropertyValue("--gutter"), 16);
  const contentMax = px(rootStyle.getPropertyValue("--content-max"), 1312);
  const safeLeft = px(rootStyle.getPropertyValue("--safe-left"), 0);
  const safeRight = px(rootStyle.getPropertyValue("--safe-right"), 0);

  // Skroll tasmasi hisobga olinmaydi: joylashuv kengligi clientWidth.
  const layoutWidth = document.documentElement.clientWidth;
  const containerWidth = Math.min(layoutWidth, contentMax + 2 * margin);
  const containerLeft = (layoutWidth - containerWidth) / 2;
  const contentLeft = containerLeft + Math.max(margin, safeLeft);
  const contentRight = containerLeft + containerWidth - Math.max(margin, safeRight);
  const columnWidth = (contentRight - contentLeft - (columns - 1) * gutter) / columns;
  const leftEdges: number[] = [];
  const rightEdges: number[] = [];
  for (let i = 0; i < columns; i += 1) {
    const left = contentLeft + i * (columnWidth + gutter);
    leftEdges.push(left);
    rightEdges.push(left + columnWidth);
  }
  const nearest = (edges: readonly number[], value: number): number =>
    edges.reduce((best, edge) => Math.min(best, Math.abs(edge - value)), Number.POSITIVE_INFINITY);

  for (const el of Array.from(document.querySelectorAll(opts.container))) {
    if (!visible(el)) continue;
    // Ichma-ich konteyner ustun ichida turadi: faqat eng tashqi konteyner chet bilan solishtiriladi.
    if (el.parentElement?.closest(opts.container)) continue;
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const left = rect.left + window.scrollX + px(cs.paddingLeft, 0);
    const right = rect.right + window.scrollX - px(cs.paddingRight, 0);
    const dl = Math.abs(left - contentLeft);
    const dr = Math.abs(right - contentRight);
    if (dl > opts.tolerance || dr > opts.tolerance) {
      findings.push({
        check: "grid-edges",
        target: label(el),
        detail: `konteyner cheti ${dl.toFixed(2)}/${dr.toFixed(2)}px surilgan`,
      });
    }
  }

  for (const el of Array.from(document.querySelectorAll(opts.gridItem))) {
    if (!visible(el)) continue;
    const rect = el.getBoundingClientRect();
    const dl = nearest(leftEdges, rect.left + window.scrollX);
    const dr = nearest(rightEdges, rect.right + window.scrollX);
    if (dl > opts.tolerance || dr > opts.tolerance) {
      findings.push({
        check: "grid-edges",
        target: label(el),
        detail: `chap ${dl.toFixed(2)}px, oʻng ${dr.toFixed(2)}px ustun chetidan uzoq`,
      });
    }
  }
  return findings;
}
