import type { IconName } from "@/components/icons/paths";

/* Punktlar tartibi loyiha yozuvidagi highlights bilan: bepul ariza, yosh, yakuniy konsert. Panel ham
   shu roʻyxatdan har dalil yonida uning belgisini koʻrsatadi. */
const HIGHLIGHT_ICONS = ["ticket", "users", "mic"] as const satisfies readonly IconName[];

export function highlightIcon(index: number): IconName {
  return HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length] ?? "star";
}
