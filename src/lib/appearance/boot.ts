/**
 * Sahifa boshida (head) ishlaydigan yagona inline skript: oyna, harakat va ovoz birinchi chizishdan
 * oldin qoʻyiladi, aks holda miltillash koʻrinadi. Mavzu esa serverda yoziladi. data-boot skript
 * ishlaganini bildiradi (BootFallback uchun), data-perf kuchsiz qurilmani: xotira ≤ 3 GB, ≤ 4 yadroli
 * Android, trafik tejash yoki 7 kun ichidagi PerfProbe oʻlchovi. Matn qoʻlda kichik tutiladi, chunki u
 * har sahifaga kiradi.
 */
export const APPEARANCE_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,k="biib:appearance",s={};try{s=JSON.parse(localStorage.getItem(k)||"{}")||{}}catch(e){}function p(v,f){v=Number(v);return isFinite(v)?Math.min(100,Math.max(0,v)):f}d.setAttribute("data-boot","");d.setAttribute("data-motion",s.motion===false?"off":"on");d.setAttribute("data-sound",s.tapSound===false?"off":"on");d.style.setProperty("--g-t",String(p(s.transparency,50)/100));d.style.setProperty("--g-d",String(p(s.density,50)/100));var n=navigator,m=n.deviceMemory,c=n.hardwareConcurrency,f=0;try{var v=JSON.parse(localStorage.getItem("biib:perf")||"null");f=v&&v.lite&&Date.now()-v.at<6048e5}catch(e){}d.setAttribute("data-perf",f||(n.connection&&n.connection.saveData)||(m&&m<=3)||(m&&c&&c<=4)?"lite":"full")}catch(e){}})();`;
