"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { motionAllowed } from "@/lib/motion/prefs";
import { useMotionPrefs } from "./motion-context";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * lens: konteyner ichidagi [data-lens] element faol [data-lens-item] ustiga prujina bilan siljiydi.
 * Joy left/width bilan yoziladi, harakat CSS oʻtishida faqat transformda (FLIP): eski joydan
 * yangisiga translate + scaleX, prujina egri chizigʻi --ease-spring. Oʻlcham oʻzgarsa qayta oʻlchanadi.
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
      const items = root.querySelectorAll<HTMLElement>("[data-lens-item]");
      const target = items[activeIndex];
      if (!lens || !target) return;
      const before = lens.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      if (rect.width === 0) return;
      lens.style.left = `${rect.left - rootRect.left + root.scrollLeft}px`;
      lens.style.width = `${rect.width}px`;
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
    const observer = new ResizeObserver(() => place(false));
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, activeIndex, animate]);
}
