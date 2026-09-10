export const THEME_STORAGE_KEY = "biib-theme";

export type ThemeChoice = "light" | "dark" | "system";

export const THEME_CHOICES: readonly ThemeChoice[] = ["light", "dark", "system"];

/**
 * Hidratsiyadan oldin işga tuşadigan skript. data-theme ni <html> ga
 * qöyadi, şuning uçun sahifa oq bölib çaqnamaydi.
 */
export const themeInitScript = `(function(){try{
var k=${JSON.stringify(THEME_STORAGE_KEY)};
var s=localStorage.getItem(k);
var m=window.matchMedia("(prefers-color-scheme: dark)").matches;
var t=(s==="light"||s==="dark")?s:(m?"dark":"light");
document.documentElement.setAttribute("data-theme",t);
document.documentElement.classList.add("js");
}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
