import type { IconName } from "@/components/icons/paths";

/* Tartib loyiha yozuvidagi highlights roʻyxati bilan bir xil: bepul ariza, yosh, yakuniy konsert. */
const HIGHLIGHT_ICONS = ["ticket", "users", "mic"] as const satisfies readonly IconName[];

export function highlightIcon(index: number): IconName {
  return HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length] ?? "star";
}
