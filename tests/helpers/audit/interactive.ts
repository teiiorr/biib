import type { Finding } from "./types";

interface Box {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

interface Item {
  readonly el: Element;
  readonly box: Box;
  readonly inline: boolean;
  readonly fixed: boolean;
  readonly name: string;
}

/** Brauzer ichida ishlaydi: nishon oʻlchami, oraliq va boshqaruv elementlari kesishuvi. */
export function auditInteractive(): Finding[] {
  const findings: Finding[] = [];
  const SELECTOR = [
    "a[href]",
    "button",
    'input:not([type="hidden"])',
    "select",
    "textarea",
    "summary",
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="menuitemradio"]',
    '[role="menuitemcheckbox"]',
    '[role="tab"]',
    '[role="slider"]',
    '[role="switch"]',
    '[role="radio"]',
    '[role="checkbox"]',
    '[role="option"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  // Oqim matni ichidagi havola WCAG 2.5.8 istisnosi: atrofida boshqa matn boʻlsa.
  const RUNNING_TEXT = new Set([
    "P",
    "LI",
    "DD",
    "DT",
    "TD",
    "TH",
    "FIGCAPTION",
    "BLOCKQUOTE",
    "SMALL",
    "SPAN",
    "EM",
    "STRONG",
    "CITE",
    "Q",
  ]);
  const label = (el: Element): string => {
    const id = el.id ? `#${el.id}` : "";
    const testId = el.getAttribute("data-testid");
    const cls = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("");
    const text = (el.textContent ?? el.getAttribute("aria-label") ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40);
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${id}${tid}${cls}${text ? ` “${text}”` : ""}`;
  };
  const toBox = (rect: DOMRect): Box => ({
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
  });
  const union = (a: Box, b: Box): Box => ({
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom),
  });
  const isInlineLink = (el: Element): boolean => {
    if (el.tagName !== "A") return false;
    const parent = el.parentElement;
    if (!parent || !RUNNING_TEXT.has(parent.tagName)) return false;
    const own = (el.textContent ?? "").trim().length;
    const around = (parent.textContent ?? "").trim().length;
    return around > own + 1;
  };

  /* ::before/::after mutlaq joylashgan bosish maydoni (inset -2px) nishon oʻlchamiga kiradi (§8 IX.5). */
  const pseudoInset = (el: Element, which: "::before" | "::after"): Box | null => {
    const ps = getComputedStyle(el, which);
    if (ps.content === "none" || ps.content === "" || ps.position !== "absolute") return null;
    const px = (v: string): number => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };
    const top = px(ps.top);
    const right = px(ps.right);
    const bottom = px(ps.bottom);
    const left = px(ps.left);
    if (top > 0 || right > 0 || bottom > 0 || left > 0) return null;
    return { left, top, right, bottom };
  };
  const isFixed = (el: Element): boolean => {
    let node: Element | null = el;
    while (node && node !== document.body) {
      const pos = getComputedStyle(node).position;
      if (pos === "fixed" || pos === "sticky") return true;
      node = node.parentElement;
    }
    return false;
  };

  const items: Item[] = [];
  for (const el of Array.from(document.body.querySelectorAll(SELECTOR))) {
    if (el.closest("svg") && el.tagName !== "svg") continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none")
      continue;
    if (el.closest("[inert]")) continue;
    const rect = el.getBoundingClientRect();
    /* Ekrandan tashqari (sr-only) 1×1 elementlar oʻlchanmaydi: fokusda kattalashadi. */
    if (rect.width <= 1 || rect.height <= 1) continue;
    let box = toBox(rect);
    for (const which of ["::before", "::after"] as const) {
      const inset = pseudoInset(el, which);
      if (inset) {
        box = {
          left: box.left + inset.left,
          top: box.top + inset.top,
          right: box.right - inset.right,
          bottom: box.bottom - inset.bottom,
        };
      }
    }
    // Belgilash katakchasi yorligʻi bilan birga bosiladi: nishon ikkalasining birlashmasi.
    if (el instanceof HTMLInputElement && el.labels) {
      for (const lab of Array.from(el.labels)) box = union(box, toBox(lab.getBoundingClientRect()));
    }
    items.push({ el, box, inline: isInlineLink(el), fixed: isFixed(el), name: label(el) });
  }

  for (const item of items) {
    if (item.inline) continue;
    const w = item.box.right - item.box.left;
    const h = item.box.bottom - item.box.top;
    if (w < 44 - 0.5 || h < 44 - 0.5) {
      findings.push({
        check: "target-size",
        target: item.name,
        detail: `${Math.round(w)}×${Math.round(h)}px, kamida 44×44 kerak`,
      });
    }
  }

  for (let i = 0; i < items.length; i += 1) {
    const a = items[i];
    if (!a) continue;
    for (let j = i + 1; j < items.length; j += 1) {
      const b = items[j];
      if (!b || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      /* Qotirilgan panel (tab-bar) hujjat koordinatalarida kontent ustidan «oʻtadi»: bu kesishuv emas. */
      if (a.fixed !== b.fixed) continue;
      const gapX = Math.max(a.box.left - b.box.right, b.box.left - a.box.right);
      const gapY = Math.max(a.box.top - b.box.bottom, b.box.top - a.box.bottom);
      if (gapX < -0.5 && gapY < -0.5) {
        findings.push({
          check: "overlap",
          target: a.name,
          detail: `${b.name} bilan kesishadi (${Math.round(-gapX)}×${Math.round(-gapY)}px)`,
        });
        continue;
      }
      if (a.inline || b.inline) continue;
      const gap = Math.max(gapX, gapY);
      if (gap < 8 - 0.5) {
        findings.push({
          check: "target-spacing",
          target: a.name,
          detail: `${b.name} gacha ${gap.toFixed(1)}px, kamida 8px kerak`,
        });
      }
    }
  }
  return findings;
}
