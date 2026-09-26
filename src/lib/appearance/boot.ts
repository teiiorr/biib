/**
 * Birinchi chizilishdan oldin `<head>` ichida ishlaydigan yagona inline skript.
 * Mavzu va oyna qiymatlari shu yerda qoʻyiladi, aks holda oq miltillash koʻrinadi.
 * Bu matn qoʻlda kichik tutiladi: u har bir sahifaga kiradi.
 */
export const APPEARANCE_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,k="biib:appearance",s={};try{s=JSON.parse(localStorage.getItem(k)||"{}")||{}}catch(e){}var t=s.theme==="light"||s.theme==="dark"?s.theme:"system";var r=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;function p(v,f){v=Number(v);return isFinite(v)?Math.min(100,Math.max(0,v)):f}d.setAttribute("data-theme",r);d.setAttribute("data-theme-choice",t);d.setAttribute("data-motion",s.motion===false?"off":"on");d.setAttribute("data-sound",s.tapSound===false?"off":"on");d.style.setProperty("--g-t",String(p(s.transparency,50)/100));d.style.setProperty("--g-d",String(p(s.density,50)/100));d.style.colorScheme=r}catch(e){}})();`;
