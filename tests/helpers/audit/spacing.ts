import type { Finding } from "./types";

export interface SpacingOptions {
  readonly selector: string;
  readonly scale: readonly number[];
  readonly tolerance: number;
}

/**
 * Brauzer ichida ishlaydi. data-audit qiymati qaysi xususiyatlar tekshirilishini aytadi
 * ("gap padding margin"); boʻsh boʻlsa gap va padding. margin faqat soʻralganda: auto qiymati
 * hisoblanganda ixtiyoriy songa aylanadi.
 */
export function auditSpacing(opts: SpacingOptions): Finding[] {
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
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${id}${tid}${cls}`;
  };
  const PROPS: Record<string, readonly string[]> = {
    gap: ["row-gap", "column-gap"],
    padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
    margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
  };
  const onScale = (value: number): boolean =>
    opts.scale.some((step) => Math.abs(step - value) <= opts.tolerance);

  for (const el of Array.from(document.querySelectorAll(opts.selector))) {
    const cs = getComputedStyle(el);
    if (cs.display === "none") continue;
    const groups = (el.getAttribute("data-audit") ?? "")
      .split(/\s+/)
      .filter((g) => g in PROPS);
    const wanted = groups.length > 0 ? groups : ["gap", "padding"];
    for (const group of wanted) {
      for (const prop of PROPS[group] ?? []) {
        const raw = cs.getPropertyValue(prop).trim();
        if (raw === "" || raw === "normal") continue;
        const value = parseFloat(raw);
        if (!Number.isFinite(value)) continue;
        if (!onScale(value)) {
          findings.push({
            check: "spacing-scale",
            target: label(el),
            detail: `${prop}: ${value.toFixed(2)}px shkalada yoʻq`,
          });
        }
      }
    }
  }
  return findings;
}
