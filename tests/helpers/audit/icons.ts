import type { Finding } from "./types";

export interface IconsOptions {
  readonly selector: string;
  readonly tolerance: number;
}

/**
 * Brauzer ichida ishlaydi. Belgi markazi yorliqning x-height (kichik harf) yoki cap (bosh harf)
 * markaziga solishtiriladi; data-icon-optical="cap" | "x" rejimni majburlaydi. Oʻlchov uchun
 * yorliq boshiga kengligi 0 boʻlgan zond qoʻyilib, darhol olib tashlanadi.
 */
export function auditIcons(opts: IconsOptions): Finding[] {
  const findings: Finding[] = [];
  const label = (el: Element): string => {
    const testId = el.getAttribute("data-testid");
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${tid}${text ? ` “${text}”` : ""}`;
  };
  const hasText = (el: Element | null): el is HTMLElement =>
    el instanceof HTMLElement && (el.textContent ?? "").trim() !== "";
  const ownText = (el: Element): boolean =>
    Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
    );
  const findLabel = (icon: Element): HTMLElement | null => {
    const parent = icon.parentElement;
    if (!parent) return null;
    if (ownText(parent)) return parent;
    if (hasText(icon.nextElementSibling)) return icon.nextElementSibling;
    if (hasText(icon.previousElementSibling)) return icon.previousElementSibling;
    return null;
  };
  const supportsCap = typeof CSS !== "undefined" && CSS.supports("height", "1cap");

  for (const icon of Array.from(document.querySelectorAll(opts.selector))) {
    const cs = getComputedStyle(icon);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rect = icon.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const text = findLabel(icon);
    if (!text) {
      findings.push({ check: "icon-centre", target: label(icon), detail: "yorliq topilmadi" });
      continue;
    }
    const mode = icon.getAttribute("data-icon-optical");
    const content = (text.textContent ?? "").trim();
    const letters = content.replace(/[^\p{L}]/gu, "");
    const useCap =
      mode === "cap" || (mode !== "x" && letters.length > 0 && letters === letters.toUpperCase());

    const probe = document.createElement("span");
    probe.style.display = "inline-block";
    probe.style.width = "0";
    probe.style.verticalAlign = "baseline";
    probe.style.height = useCap && supportsCap ? "1cap" : "1ex";
    text.insertBefore(probe, text.firstChild);
    const probeRect = probe.getBoundingClientRect();
    const baseline = probeRect.bottom;
    let glyphHeight = probeRect.height;
    if (useCap && !supportsCap) {
      // cap birligi yoʻq brauzer: bosh harf balandligi taxminan 0.72em.
      glyphHeight = parseFloat(getComputedStyle(text).fontSize) * 0.72;
    }
    probe.remove();

    const target = baseline - glyphHeight / 2;
    const centre = rect.top + rect.height / 2;
    const delta = centre - target;
    if (Math.abs(delta) > opts.tolerance) {
      findings.push({
        check: "icon-centre",
        target: label(icon),
        detail: `belgi markazi ${delta.toFixed(2)}px ${delta > 0 ? "past" : "yuqori"} (${useCap ? "cap" : "x-height"})`,
      });
    }
  }
  return findings;
}
