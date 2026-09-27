"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GOLD = ".gold-text";
/* Skroll toʻxtagandan keyin yaltirash shuncha kutib davom etadi (faqat yengil rejim). */
const SCROLL_IDLE_MS = 180;

/**
 * Oltin yaltirash faqat sarlavha ekranda (±100 px) boʻlganda aylanadi: ekrandan chiqqan sarlavhaga
 * data-gold-off qoʻyiladi, motion.css animatsiyani toʻxtatadi. Koʻrinadigan sarlavhada yaltirash
 * uzluksiz qoladi; sukut holati ishlab turish, shuning uchun JS siz va gidratsiyadan oldin hech narsa
 * oʻzgarmaydi. Yengil rejimda (data-perf="lite") barmoq skroll qilayotganda ham tasma kutib turadi.
 */
export function GoldShineGate() {
  const pathname = usePathname();
  const rescan = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          entry.target.toggleAttribute("data-gold-off", !entry.isIntersecting);
      },
      { rootMargin: "100px 0px" },
    );
    const watched = new Set<Element>();
    const scan = (): void => {
      for (const el of watched) {
        if (el.isConnected) continue;
        io.unobserve(el);
        watched.delete(el);
      }
      for (const el of document.querySelectorAll(GOLD)) {
        if (watched.has(el)) continue;
        watched.add(el);
        io.observe(el);
      }
    };
    /* Keyin keladigan sarlavhalar (oqimli kontent, dialoglar): bir kadrda bitta qayta koʻrish. */
    let frame = 0;
    const mo = new MutationObserver((records) => {
      if (frame !== 0) return;
      const added = records.some((r) => Array.from(r.addedNodes).some((n) => n instanceof Element));
      if (added) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          scan();
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    scan();
    rescan.current = scan;

    let idle = 0;
    const onScroll = (): void => {
      if (root.dataset.perf !== "lite") return;
      if (!("scrolling" in root.dataset)) root.dataset.scrolling = "";
      window.clearTimeout(idle);
      idle = window.setTimeout(() => delete root.dataset.scrolling, SCROLL_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      rescan.current = null;
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
      io.disconnect();
      delete root.dataset.scrolling;
      for (const el of watched) el.removeAttribute("data-gold-off");
    };
  }, []);

  // Sahifa almashganda yangi sarlavhalar darhol kuzatuvga olinadi.
  useEffect(() => {
    rescan.current?.();
  }, [pathname]);

  return null;
}
