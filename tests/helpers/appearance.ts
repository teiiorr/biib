import type { Page } from "@playwright/test";
import { STORAGE_KEY, type Appearance } from "../../src/lib/appearance/types";

/* Sayt faqat tungi mavzuda: mavzu serverda yoziladi, tanlov yoʻq. */
export type Theme = "dark";
export const THEMES: readonly Theme[] = ["dark"];
export const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";

export interface StoredAppearance {
  readonly transparency?: number;
  readonly density?: number;
  readonly motion?: boolean;
}

/** Sahifa skriptlaridan oldin localStorage ga yoziladi: boot skript birinchi chizilishda oʻqiydi. */
export async function primeAppearance(page: Page, stored: StoredAppearance = {}): Promise<void> {
  const value: Appearance = {
    transparency: stored.transparency ?? 50,
    density: stored.density ?? 50,
    motion: stored.motion ?? true,
    tapSound: false,
  };
  await page.addInitScript(
    ([key, json]) => {
      try {
        // Init skript har hujjatda yuradi; qayta yuklashda saqlangan tanlov oʻchmasligi kerak.
        if (sessionStorage.getItem("biib:primed") === json) return;
        sessionStorage.setItem("biib:primed", json);
        localStorage.setItem(key, json);
      } catch {
        return;
      }
    },
    [STORAGE_KEY, JSON.stringify(value)] as const,
  );
}

/** Boot skript, shriftlar va tarmoq tinchigach davom etadi; video oqimi networkidle ni ushlab qolmasin. */
export async function settle(page: Page): Promise<void> {
  await page.waitForSelector("html[data-theme]", { state: "attached" });
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
}

/** Skroll bilan ochiladigan bloklarni koʻrsatib, boshiga qaytadi: geometriya tinch holatda oʻlchanadi. */
export async function revealAll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    const max = () => document.documentElement.scrollHeight - window.innerHeight;
    for (let y = 0; y <= max(); y += step) {
      window.scrollTo(0, y);
      await frame();
      await pause(40);
    }
    window.scrollTo(0, max());
    await pause(120);
    window.scrollTo(0, 0);
    await frame();
  });
  await page.waitForTimeout(400);
}
