import { DEFAULT_APPEARANCE, STORAGE_KEY, normalizeAppearance, type Appearance } from "./types";

export function readStorage(): Appearance {
  try {
    return normalizeAppearance(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function writeStorage(appearance: Appearance): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
  } catch {
    // Maxfiy rejim yoki toʻlgan xotira: sozlama faqat shu sahifa uchun qoladi.
  }
}

function percentFromVariable(value: string, fallback: number): number {
  const trimmed = value.trim();
  if (trimmed === "") return fallback;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(Math.min(1, Math.max(0, n)) * 100);
}

/** Boot skript qoʻygan atributlardan oʻqiladi: server bilan gidratsiya mos keladi, miltillash yoʻq. */
export function readAppearanceFromDocument(): Appearance {
  if (typeof document === "undefined") return DEFAULT_APPEARANCE;
  const html = document.documentElement;
  const stored = readStorage();
  /* Boot skript ishlamagan (404 xato qobigʻi): atributlar server sukutlari, haqiqat saqlangan qiymatda. */
  if (!html.hasAttribute("data-boot")) return stored;
  const motion = html.getAttribute("data-motion");
  const sound = html.getAttribute("data-sound");
  return {
    transparency: percentFromVariable(html.style.getPropertyValue("--g-t"), stored.transparency),
    density: percentFromVariable(html.style.getPropertyValue("--g-d"), stored.density),
    motion: motion ? motion !== "off" : stored.motion,
    tapSound: sound ? sound !== "off" : stored.tapSound,
  };
}

export function applyAppearance(appearance: Appearance): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-motion", appearance.motion ? "on" : "off");
  html.setAttribute("data-sound", appearance.tapSound ? "on" : "off");
  html.style.setProperty("--g-t", String(appearance.transparency / 100));
  html.style.setProperty("--g-d", String(appearance.density / 100));
}
