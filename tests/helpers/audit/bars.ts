import type { Finding } from "./types";

export interface BarsOptions {
  readonly bars: readonly string[];
  readonly check: "under-header" | "under-tabbar";
}

/** Brauzer ichida ishlaydi. Joriy skroll holatida qotirilgan panel ostida qolgan matnni topadi. */
export function auditUnderBars(opts: BarsOptions): Finding[] {
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
  const ownText = (el: Element): boolean =>
    Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
    );
  const px = (value: string): number => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  };

  const rootStyle = getComputedStyle(document.documentElement);
  const safeTop = px(rootStyle.getPropertyValue("--safe-top"));
  const safeBottom = px(rootStyle.getPropertyValue("--safe-bottom"));

  for (const selector of opts.bars) {
    const start = document.querySelector(selector);
    if (!(start instanceof HTMLElement)) continue;
    const cs = getComputedStyle(start);
    if (cs.display === "none" || cs.visibility === "hidden" || px(cs.opacity) === 0) continue;
    // Testid ichki elementda boʻlishi mumkin; qotirilgan ota quti panel chegarasi.
    let bar: HTMLElement = start;
    let cursor: HTMLElement | null = start;
    while (cursor) {
      const position = getComputedStyle(cursor).position;
      if (position === "fixed" || position === "sticky") {
        bar = cursor;
        break;
      }
      cursor = cursor.parentElement;
    }
    const box = bar.getBoundingClientRect();
    if (box.height === 0 || box.width === 0) continue;
    const top = opts.check === "under-header" ? Math.min(box.top, safeTop) : box.top;
    const bottom =
      opts.check === "under-tabbar"
        ? Math.max(box.bottom, window.innerHeight - safeBottom)
        : box.bottom;

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (!(el instanceof HTMLElement) || bar.contains(el)) continue;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.display === "inline" || style.visibility === "hidden") {
        continue;
      }
      if (style.position === "fixed" || style.position === "sticky") continue;
      if (!ownText(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue;
      const overlapX = Math.min(rect.right, box.right) - Math.max(rect.left, box.left);
      const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
      if (overlapX > 1 && overlapY > 1) {
        findings.push({
          check: opts.check,
          target: label(el),
          detail: `${Math.round(overlapY)}px matn ${selector} ostida`,
        });
      }
    }
  }
  return findings;
}
