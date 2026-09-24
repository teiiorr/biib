import type { Finding } from "./types";

/** Brauzer ichida ishlaydi: tashqi import yoʻq, hamma yordamchi shu yerda. */
export function auditClip(): Finding[] {
  const findings: Finding[] = [];
  const TEXT_TAGS = new Set([
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "P",
    "LI",
    "DT",
    "DD",
    "BUTTON",
    "LABEL",
    "FIGCAPTION",
    "BLOCKQUOTE",
    "SUMMARY",
    "LEGEND",
    "TH",
    "TD",
    "TIME",
    "OUTPUT",
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
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    const tid = testId ? `[data-testid="${testId}"]` : "";
    return `${el.tagName.toLowerCase()}${id}${tid}${cls}${text ? ` “${text}”` : ""}`;
  };
  const ownText = (el: Element): boolean =>
    Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
    );

  const root = document.documentElement;
  if (root.scrollWidth > window.innerWidth) {
    findings.push({
      check: "overflow",
      target: "html",
      detail: `scrollWidth ${root.scrollWidth} > innerWidth ${window.innerWidth}`,
    });
  }

  for (const el of Array.from(document.body.querySelectorAll("*:not(svg):not(svg *)"))) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "TEMPLATE") continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.display === "contents" || cs.display === "inline") continue;
    if (cs.visibility === "hidden") continue;
    if (!(ownText(el) || TEXT_TAGS.has(el.tagName))) continue;
    if (el.closest("[data-clamp]")) continue;
    if (/auto|scroll/.test(cs.overflowX) || /auto|scroll/.test(cs.overflowY)) continue;
    const rect = el.getBoundingClientRect();
    // Ekrandan tashqari yordamchi matn (sr-only) 1×1 px: oʻlchanmaydi.
    if (rect.width <= 1 || rect.height <= 1) continue;

    /*
     * Balandlik: glif chegarasi qator qutisidan chiqishi (zich sarlavha, iqtibos) qirqish emas.
     * Haqiqiy qirqish — overflow yashiradigan eng yaqin ajdod qutisidan matnning chiqishi.
     */
    const clipper = (start: HTMLElement): HTMLElement | null => {
      let node: HTMLElement | null = start;
      while (node && node !== document.body) {
        const st = getComputedStyle(node);
        if (
          /hidden|clip|auto|scroll/.test(st.overflowY) ||
          /hidden|clip|auto|scroll/.test(st.overflowX)
        )
          return node;
        node = node.parentElement;
      }
      return null;
    };
    if (el.scrollWidth > el.clientWidth + 1 && !/hidden|clip/.test(cs.overflowX)) {
      // Kenglik: soʻz oʻz qutisidan chiqib ketgan (uzun soʻz, nowrap) — bu doim xato.
      const inkRight = el.getBoundingClientRect().left + el.scrollWidth;
      if (inkRight > window.innerWidth + 1) {
        findings.push({
          check: "clip",
          target: label(el),
          detail: `scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}, ekrandan chiqadi`,
        });
      }
    }
    const host = clipper(el);
    if (host) {
      const box = host.getBoundingClientRect();
      const overY = Math.max(0, el.scrollHeight - el.clientHeight);
      const overX = Math.max(0, el.scrollWidth - el.clientWidth);
      const clippedY = rect.bottom + overY > box.bottom + 1 || rect.top < box.top - 1;
      const clippedX = rect.right + overX > box.right + 1 || rect.left < box.left - 1;
      if (clippedX || clippedY) {
        findings.push({
          check: "clip",
          target: label(el),
          detail: `matn ${label(host)} ichida qirqiladi (${clippedX ? "x" : ""}${clippedY ? "y" : ""})`,
        });
      }
    }
  }
  return findings;
}
