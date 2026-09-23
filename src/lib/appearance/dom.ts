import {
  DEFAULT_APPEARANCE,
  STORAGE_KEY,
  isDesign,
  isThemeChoice,
  normalizeAppearance,
  type Appearance,
  type ResolvedTheme,
  type ThemeChoice,
} from "./types";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light";
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  return choice === "system" ? systemTheme() : choice;
}

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
  const design = html.getAttribute("data-design");
  const theme = html.getAttribute("data-theme-choice");
  const motion = html.getAttribute("data-motion");
  const sound = html.getAttribute("data-sound");
  return {
    design: isDesign(design) ? design : stored.design,
    theme: isThemeChoice(theme) ? theme : stored.theme,
    transparency: percentFromVariable(html.style.getPropertyValue("--g-t"), stored.transparency),
    density: percentFromVariable(html.style.getPropertyValue("--g-d"), stored.density),
    motion: motion ? motion !== "off" : stored.motion,
    sound: sound ? sound === "on" : stored.sound,
  };
}

export function applyAppearance(appearance: Appearance, resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-design", appearance.design);
  html.setAttribute("data-theme", resolved);
  html.setAttribute("data-theme-choice", appearance.theme);
  html.setAttribute("data-motion", appearance.motion ? "on" : "off");
  html.setAttribute("data-sound", appearance.sound ? "on" : "off");
  html.style.setProperty("--g-t", String(appearance.transparency / 100));
  html.style.setProperty("--g-d", String(appearance.density / 100));
  html.style.colorScheme = resolved;
}
