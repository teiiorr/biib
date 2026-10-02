"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Next 404 va xato chegaralarini har sahifaning birinchi yuklanishiga qoʻshadi, shuning uchun chegarada
 * faqat shu kichik yuklovchi turadi: koʻrinishning oʻzi chegara chizilganda alohida boʻlak boʻlib keladi.
 * Suspense ishlatilmaydi, chunki u ochilganda sahifa oʻtishi (View Transition) ishga tushadi.
 */
export function useLazyView<P>(load: () => Promise<ComponentType<P>>): {
  readonly View: ComponentType<P> | null;
} {
  const [View, setView] = useState<ComponentType<P> | null>(null);
  useEffect(() => {
    let cancelled = false;
    void load().then((component) => {
      if (!cancelled) setView(() => component);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);
  return { View };
}
