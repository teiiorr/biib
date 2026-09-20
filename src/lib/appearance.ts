export const INTENSITY_KEY = "biib-glass-intensity";
export const MOTION_KEY = "biib-motion";
export const TEXT_KEY = "biib-text";
export const CONTRAST_KEY = "biib-contrast";
export const VIDEO_KEY = "biib-hero-video";

export const DEFAULT_INTENSITY = 0.5;

export type MotionSetting = "auto" | "reduce" | "full";
export type TextSetting = "md" | "lg" | "xl";
export type ContrastSetting = "auto" | "more";

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_INTENSITY;
  return Math.min(1, Math.max(0, Math.round(value * 10) / 10));
}

/**
 * Birinçi çizişdan oldin işlaydi. Mavzu tanlovi yöq — brend qorongʻi
 * fonda yaşaydi (§16.2). Bu yerda şişa zichligi va qulaylik tanlovlari:
 * harakat, matn ölçami, kontrast. Hammasi <html> atributlarida — CSS
 * uçun yagona manba: tizim sozlamasi şu atributga közgulanadi, özgarsa
 * jonli yangilanadi, saytdagi tumbler esa "biib:appearance" hodisasi
 * bilan şu yerni qayta işlatadi.
 * data-js skrolldagi çiqişni yoqadi: JS öçiq bölsa matn darrov körinadi.
 * Sinf emas, atribut — çunki <html> ning className ni React gidratatsiya
 * paytida öz qiymatiga qaytaradi va skript qöşgan sinf yöqolib ketadi.
 */
export const appearanceInitScript = `(function(){try{
var d=document.documentElement;
d.setAttribute("data-js","");
var i=parseFloat(localStorage.getItem(${JSON.stringify(INTENSITY_KEY)}));
if(!isNaN(i)&&i>=0&&i<=1)d.style.setProperty("--glass-intensity",String(i));
function read(k){try{return localStorage.getItem(k)}catch(e){return null}}
function attr(n,v){if(v)d.setAttribute(n,v);else d.removeAttribute(n)}
var mMq=matchMedia("(prefers-reduced-motion: reduce)");
function applyMotion(){
  var s=read(${JSON.stringify(MOTION_KEY)});
  attr("data-motion",s==="reduce"||s==="full"?s:(mMq.matches?"reduce":null));
}
var cMq=matchMedia("(prefers-contrast: more)");
function applyContrast(){
  var s=read(${JSON.stringify(CONTRAST_KEY)});
  attr("data-contrast",s==="more"||cMq.matches?"more":null);
}
function applyText(){
  var s=read(${JSON.stringify(TEXT_KEY)});
  attr("data-text",s==="lg"||s==="xl"?s:null);
}
applyMotion();applyContrast();applyText();
if(mMq.addEventListener){
  mMq.addEventListener("change",applyMotion);
  cMq.addEventListener("change",applyContrast);
}
window.addEventListener("biib:appearance",function(){applyMotion();applyContrast();applyText()});
}catch(e){}})();`;
