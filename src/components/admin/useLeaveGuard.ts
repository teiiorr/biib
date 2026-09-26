"use client";

import { useEffect } from "react";

/**
 * Saqlanmagan oʻzgarish bor ekan: sahifani yopish yoki yangilashda brauzer soʻraydi, panel ichidagi
 * havolaga oʻtishda esa tasdiqlash oynasi chiqadi (Next havolasi beforeunload ni chaqirmaydi).
 */
export function useLeaveGuard(active: boolean, message: string): void {
  useEffect(() => {
    if (!active) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    /* Hujjatning ushlash bosqichida: React ildiz tinglovchisidan (Link) oldin ishlaydi. */
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      if (link.origin !== window.location.origin) return;
      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
    };
  }, [active, message]);
}
