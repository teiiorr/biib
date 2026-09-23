export const DESIGNS = ["atlas", "birlashma"] as const;
export type Design = (typeof DESIGNS)[number];

export const THEME_CHOICES = ["light", "dark", "system"] as const;
export type ThemeChoice = (typeof THEME_CHOICES)[number];
export type ResolvedTheme = "light" | "dark";

export interface Appearance {
  readonly design: Design;
  readonly theme: ThemeChoice;
  /** Shaffoflik, 0–100. */
  readonly transparency: number;
  /** Zichlik, 0–100. */
  readonly density: number;
  readonly sound: boolean;
  readonly motion: boolean;
}

export const STORAGE_KEY = "biib:appearance";
export const DESIGN_QUERY = "dizayn";

export const DEFAULT_APPEARANCE: Appearance = {
  design: "atlas",
  theme: "system",
  transparency: 50,
  density: 50,
  sound: false,
  motion: true,
};

export function isDesign(value: unknown): value is Design {
  return value === "atlas" || value === "birlashma";
}

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === "light" || value === "dark" || value === "system";
}

function clampPercent(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

/** localStorage dan kelgan ixtiyoriy qiymatni xavfsiz Appearance ga keltiradi. */
export function normalizeAppearance(raw: unknown): Appearance {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    design: isDesign(r.design) ? r.design : DEFAULT_APPEARANCE.design,
    theme: isThemeChoice(r.theme) ? r.theme : DEFAULT_APPEARANCE.theme,
    transparency: clampPercent(r.transparency, DEFAULT_APPEARANCE.transparency),
    density: clampPercent(r.density, DEFAULT_APPEARANCE.density),
    sound: r.sound === true,
    motion: r.motion !== false,
  };
}
