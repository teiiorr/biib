"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * 404 va xato chegaralari har sahifaning birinchi yuklanishiga kiradi (Next ularni layout bilan
 * birga yuboradi). Chegara faqat shu kichik yuklovchi: koʻrinish (sarlavha, matn, tugmalar) chegara
 * haqiqatan chizilganda alohida chunk boʻlib keladi. Suspense emas: uning ochilishi sahifa
 * View Transition ini ishga tushirardi.
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
