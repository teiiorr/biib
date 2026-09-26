"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { motionAllowed } from "@/lib/motion/prefs";
import { useMotionPrefs } from "./motion-context";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* Linza yorliqdan har tomonga 4 px keng (bandlar orasidagi 8 px ga kiradi), kamida 56 px. */
const LENS_PAD = 4;
const LENS_MIN = 56;

/**
 * lens: konteyner ichidagi [data-lens] element faol [data-lens-item] ustiga prujina bilan siljiydi.
 * Joy left/width bilan yoziladi, harakat CSS oʻtishida faqat transformda (FLIP): eski joydan
 * yangisiga translate + scaleX, prujina egri chizigʻi --ease-spring. Oʻlcham oʻzgarsa qayta oʻlchanadi.
 * activeIndex < 0: faol band yoʻq (masalan 404), linza yashiriladi.
 */
export function useLens(ref: RefObject<HTMLElement | null>, activeIndex: number): void {
  const prefs = useMotionPrefs();
  const animate = prefs.ready && motionAllowed(prefs);
  const settled = useRef(false);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const place = (withMotion: boolean): void => {
      const lens = root.querySelector<HTMLElement>("[data-lens]");
      if (!lens) return;
      const items = root.querySelectorAll<HTMLElement>("[data-lens-item]");
      const target = activeIndex >= 0 ? items[activeIndex] : undefined;
      if (!target) {
        lens.style.opacity = "0";
        settled.current = false;
        return;
      }
      lens.style.opacity = "";
      const before = lens.getBoundingClientRect();
      /* Oʻlcham layout qiymatlaridan (offset*): panel yigʻilish animatsiyasida scale qilingan boʻlsa ham
         linza bandning haqiqiy kengligi va markazida turadi (getBoundingClientRect transformni ham oʻlchardi). */
      const itemWidth = target.offsetWidth;
      if (itemWidth === 0) return;
      const rootWidth = root.clientWidth;
      const inset = 2;
      const width = Math.min(rootWidth - inset * 2, Math.max(LENS_MIN, itemWidth + LENS_PAD * 2));
      const center = target.offsetLeft + itemWidth / 2;
      const left = Math.min(Math.max(inset, center - width / 2), rootWidth - inset - width);
      lens.style.left = `${left}px`;
      lens.style.width = `${width}px`;
      // Birinchi joylashuv, oʻlcham oʻzgarishi va harakat taqiqi: animatsiyasiz.
      if (!withMotion || !settled.current || before.width === 0) {
        settled.current = true;
        return;
      }
      const after = lens.getBoundingClientRect();
      lens.style.transition = "none";
      lens.style.transform = `translateX(${before.left - after.left}px) scaleX(${before.width / after.width})`;
      // Boshlangʻich holat qoʻllanishi uchun bir marta oʻlchanadi, keyin oʻtish yoqiladi.
      void lens.offsetWidth;
      lens.style.transition = "";
      lens.style.transform = "";
    };
    place(animate);
    /* Panel oʻlchami oʻzgarmasa ham bandlar kengayishi mumkin (shrift yuklandi, til almashdi): har band
       kuzatiladi, shriftlar tayyor boʻlgach yana bir bor joylanadi. */
    const observer = new ResizeObserver(() => place(false));
    observer.observe(root);
    for (const item of root.querySelectorAll<HTMLElement>("[data-lens-item]"))
      observer.observe(item);
    let alive = true;
    void document.fonts?.ready.then(() => {
      if (alive) place(false);
    });
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [ref, activeIndex, animate]);
}
