export {
  DESIGNS,
  THEME_CHOICES,
  DEFAULT_APPEARANCE,
  STORAGE_KEY,
  DESIGN_QUERY,
  isDesign,
  isThemeChoice,
  normalizeAppearance,
} from "./types";
export type { Appearance, Design, ThemeChoice, ResolvedTheme } from "./types";
export { APPEARANCE_BOOT_SCRIPT } from "./boot";
export { AppearanceProvider, useAppearance } from "./context";
export type { AppearanceValue } from "./context";
export { setTheme, switchDesign } from "./transitions";
export type { ThemeOrigin, TransitionType } from "./transitions";
export {
  getAppearanceSnapshot,
  setAppearance,
  resetAppearance,
  subscribeAppearance,
} from "./store";
export type { AppearanceSnapshot } from "./store";
export {
  useMediaQuery,
  useReducedTransparency,
  useReducedMotion,
  useIsDesktop,
} from "./media";
export { readAppearanceFromDocument, resolveTheme } from "./dom";
