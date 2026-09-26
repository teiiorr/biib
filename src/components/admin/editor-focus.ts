import type { FieldErrors } from "@/lib/admin/news/types";

/**
 * Xato kalitidan maydon id si: «title.ru» → `${form}-title-ru`. Tartib sahifadagi koʻrinish tartibi:
 * birinchi xato shu roʻyxat boʻyicha tanlanadi.
 */
export function firstErrorId(
  errors: FieldErrors,
  order: readonly string[],
  idFor: (field: string) => string,
): string | null {
  const keys = Object.keys(errors);
  for (const field of order) {
    const key = keys.find((k) => k === field || k.startsWith(`${field}.`));
    if (!key) continue;
    const locale = key.includes(".") ? key.slice(key.indexOf(".") + 1) : null;
    return locale ? `${idFor(field)}-${locale}` : idFor(field);
  }
  return null;
}

/**
 * Maydonga fokus: yopiq til tabida boʻlsa avval tab ochiladi. Yopishqoq saqlash paneli ostida
 * qolmasin deb maydon ekran oʻrtasiga suriladi.
 */
export function focusField(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;
  const panel = element.closest<HTMLElement>("[role=tabpanel]");
  const reveal = () => {
    element.scrollIntoView({ block: "center" });
    element.focus({ preventScroll: true });
  };
  if (panel?.hidden) {
    document.getElementById(panel.getAttribute("aria-labelledby") ?? "")?.click();
    requestAnimationFrame(reveal);
    return;
  }
  reveal();
}
