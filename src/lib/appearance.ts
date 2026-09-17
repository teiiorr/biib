export const THEME_KEY = "biib-theme";
export const INTENSITY_KEY = "biib-glass-intensity";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const DEFAULT_INTENSITY = 0.5;

/** Suruvçining üç nomlangan holati — §6.10. */
export const INTENSITY_STOPS = [0, 0.5, 1] as const;

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_INTENSITY;
  return Math.min(1, Math.max(0, Math.round(value * 10) / 10));
}

/**
 * Birinçi çizişdan oldin işlaydi: mavzuni ham, şişa zichligini ham
 * qöyadi. Busiz sahifa yuklanganda standart holat bir lahza körinib
 * ketadi — vspışka.
 */
export const appearanceInitScript = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});
var m=window.matchMedia("(prefers-color-scheme: dark)").matches;
d.setAttribute("data-theme",(t==="light"||t==="dark")?t:(m?"dark":"light"));
var i=parseFloat(localStorage.getItem(${JSON.stringify(INTENSITY_KEY)}));
if(!isNaN(i)&&i>=0&&i<=1)d.style.setProperty("--glass-intensity",String(i));
if(window.matchMedia("(prefers-reduced-transparency: reduce)").matches)d.setAttribute("data-reduced-transparency","");
}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
