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

    const trim = cs.getPropertyValue("text-box-trim").trim();
    const ratio = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
    /* Zich qatorli sarlavhalar (≤1.2): glif chegarasi qator qutisidan chiqadi, ota quti hisob. */
    const againstParent =
      (trim !== "" && trim !== "none") || (Number.isFinite(ratio) && ratio < 1.2);
    if (againstParent) {
      // Qirqilgan sarlavha: oʻz qutisi emas, ota quti hisob. Qatorning toʻliq balandligi sigʻishi kerak.
      const parent = el.parentElement;
      if (!parent) continue;
      const box = parent.getBoundingClientRect();
      const over = Math.max(0, el.scrollHeight - el.clientHeight) / 2;
      const clippedX = el.scrollWidth > parent.clientWidth + 1 || rect.right > box.right + 1;
      const clippedY = rect.top - over < box.top - 1 || rect.bottom + over > box.bottom + 1;
      if (clippedX || clippedY) {
        findings.push({
          check: "clip",
          target: label(el),
          detail: `qirqilgan matn ota qutidan chiqadi (${clippedX ? "x" : ""}${clippedY ? "y" : ""})`,
        });
      }
      continue;
    }
    if (el.scrollWidth > el.clientWidth + 1) {
      findings.push({
        check: "clip",
        target: label(el),
        detail: `scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}`,
      });
    }
    if (el.scrollHeight > el.clientHeight + 1) {
      findings.push({
        check: "clip",
        target: label(el),
        detail: `scrollHeight ${el.scrollHeight} > clientHeight ${el.clientHeight}`,
      });
    }
  }
  return findings;
}
