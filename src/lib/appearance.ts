export const INTENSITY_KEY = "biib-glass-intensity";

export const DEFAULT_INTENSITY = 0.5;

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_INTENSITY;
  return Math.min(1, Math.max(0, Math.round(value * 10) / 10));
}

/**
 * Birinçi çizişdan oldin işlaydi. Mavzu tanlovi yöq — brend qorongʻi
 * fonda yaşaydi (§16.2), şuning uçun bu yerda faqat şişa zichligi.
 * .js sinfi skrolldagi çiqişni yoqadi: JS öçiq bölsa matn darrov körinadi.
 */
export const appearanceInitScript = `(function(){try{
var d=document.documentElement;
d.classList.add("js");
var i=parseFloat(localStorage.getItem(${JSON.stringify(INTENSITY_KEY)}));
if(!isNaN(i)&&i>=0&&i<=1)d.style.setProperty("--glass-intensity",String(i));
}catch(e){}})();`;
