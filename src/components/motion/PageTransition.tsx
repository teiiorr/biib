"use client";

import { usePathname } from "next/navigation";
import { useEffect, ViewTransition, type ReactNode } from "react";
import { DURATION } from "@/lib/motion/constants";
import { scheduleScrollRefresh } from "@/lib/motion/refresh";
import { commitPath, NAV_FADE_CLASS, recordNavigation } from "@/lib/motion/transitions";

/** transitions.css fayli ::view-transition-old/new(.vt-page) uslubini shu sinf orqali beradi. */
export const PAGE_TRANSITION_CLASS = "vt-page";

interface PageTransitionProps {
  readonly children: ReactNode;
}

/**
 * Sarlavha paneli va sahifa osti chegaradan tashqarida qoladi, oʻtish faqat sahifa mazmuniga tegadi.
 * Oʻtish tugagach sahnalar joylashuvi qayta oʻlchanadi, chunki oʻtish davomida sahifa hali siljiyotgan boʻladi.
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
