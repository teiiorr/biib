import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] as const;

/** Har bir buzilish bitta qator: qoida, ogʻirlik, tugun soni va birinchi nishon. */
export async function axeViolations(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).withTags([...AXE_TAGS]).analyze();
  return results.violations.map((violation) => {
    const first = violation.nodes[0];
    const target = first ? first.target.map(String).join(" ") : "";
    return `${violation.id} (${violation.impact ?? "?"}) ×${violation.nodes.length} ${target}`.trim();
  });
}
