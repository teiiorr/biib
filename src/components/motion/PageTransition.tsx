"use client";

import { usePathname } from "next/navigation";
import { useEffect, ViewTransition, type ReactNode } from "react";
import { DURATION } from "@/lib/motion/constants";
import { scheduleScrollRefresh } from "@/lib/motion/refresh";
import { commitPath, NAV_FADE_CLASS, recordNavigation } from "@/lib/motion/transitions";

/** transitions.css shu sinf boʻyicha ::view-transition-old/new(.vt-page) ni bezaydi. */
export const PAGE_TRANSITION_CLASS = "vt-page";

interface PageTransitionProps {
  readonly children: ReactNode;
}

/**
 * Sahifa mazmunini ViewTransition chegarasiga oʻraydi (layoutda, header/futer tashqarida qoladi).
 * Yoʻl oʻzgarganda tarix yoziladi, zaxira soʻnish sinfi olib tashlanadi va oʻtish tugagach
 * sahnalar joylashuvni bir marta qayta oʻlchaydi (oʻtish davomida sahifa hali siljiyotgan edi).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    recordNavigation(pathname);
    commitPath(pathname);
    document.body.classList.remove(NAV_FADE_CLASS);
    const timer = window.setTimeout(scheduleScrollRefresh, DURATION.transition * 1000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <ViewTransition default={PAGE_TRANSITION_CLASS}>{children}</ViewTransition>;
}
