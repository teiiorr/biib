"use client";

import { usePathname } from "next/navigation";
import { useEffect, ViewTransition, type ReactNode } from "react";
import { NAV_FADE_CLASS, recordNavigation } from "@/lib/motion/transitions";

/** transitions.css shu sinf boʻyicha ::view-transition-old/new(.vt-page) ni bezaydi. */
export const PAGE_TRANSITION_CLASS = "vt-page";

interface PageTransitionProps {
  readonly children: ReactNode;
}

/**
 * Sahifa mazmunini ViewTransition chegarasiga oʻraydi (layoutda, header/futer tashqarida qoladi).
 * Yoʻl oʻzgarganda tarix yoziladi va zaxira soʻnish sinfi olib tashlanadi.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    recordNavigation(pathname);
    document.body.classList.remove(NAV_FADE_CLASS);
  }, [pathname]);

  return <ViewTransition default={PAGE_TRANSITION_CLASS}>{children}</ViewTransition>;
}
