import type { Finding } from "./types";

export interface CardsOptions {
  readonly group: string;
  readonly card: string;
  readonly title: string;
  readonly cta: string;
  readonly tolerance: number;
}

interface CardBox {
  readonly name: string;
  readonly top: number;
  readonly titleTop: number | null;
  readonly ctaBottom: number | null;
}

/** Brauzer ichida ishlaydi: bir qatordagi kartalarda sarlavha tepasi va CTA pasti bir chiziqda. */
export function auditCards(opts: CardsOptions): Finding[] {
  const findings: Finding[] = [];
  const label = (el: Element): string => {
    const id = el.id ? `#${el.id}` : "";
    const testId = el.getAttribute("data-testid");
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${id}${tid}${text ? ` “${text}”` : ""}`;
  };
  const visible = (el: Element): boolean => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const pick = (
    card: Element,
    explicit: string,
    fallback: string,
    last: boolean,
  ): Element | null => {
    const marked = card.querySelector(explicit);
    if (marked) return marked;
    const candidates = Array.from(card.querySelectorAll(fallback)).filter(visible);
    return (last ? candidates[candidates.length - 1] : candidates[0]) ?? null;
  };

  for (const group of Array.from(document.querySelectorAll(opts.group))) {
    if (!visible(group)) continue;
    const marked = Array.from(group.querySelectorAll(opts.card));
    const cards = (marked.length > 0 ? marked : Array.from(group.children)).filter(visible);
    if (cards.length < 2) continue;
    const boxes: CardBox[] = cards.map((card) => {
      const title = pick(card, opts.title, "h2,h3,h4", false);
      const cta = pick(card, opts.cta, "a[href],button", true);
      return {
        name: label(card),
        top: card.getBoundingClientRect().top,
        titleTop: title ? title.getBoundingClientRect().top : null,
        ctaBottom: cta ? cta.getBoundingClientRect().bottom : null,
      };
    });
    // Qatorlar: tepasi bir xil (±1px) kartalar; ustun holatida har karta oʻz qatori.
    const rows: CardBox[][] = [];
    for (const box of boxes) {
      const row = rows.find((r) => r[0] !== undefined && Math.abs(r[0].top - box.top) <= 1);
      if (row) row.push(box);
      else rows.push([box]);
    }
    for (const row of rows) {
      if (row.length < 2) continue;
      const titles = row.map((b) => b.titleTop).filter((v): v is number => v !== null);
      const ctas = row.map((b) => b.ctaBottom).filter((v): v is number => v !== null);
      const spread = (values: number[]): number =>
        values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
      const titleSpread = spread(titles);
      const ctaSpread = spread(ctas);
      if (titleSpread > opts.tolerance) {
        findings.push({
          check: "card-rows",
          target: label(group),
          detail: `sarlavha tepalari ${titleSpread.toFixed(2)}px farq qiladi (${row.map((b) => b.name).join(" | ")})`,
        });
      }
      if (ctaSpread > opts.tolerance) {
        findings.push({
          check: "card-rows",
          target: label(group),
          detail: `CTA pastlari ${ctaSpread.toFixed(2)}px farq qiladi (${row.map((b) => b.name).join(" | ")})`,
        });
      }
    }
  }
  return findings;
}
