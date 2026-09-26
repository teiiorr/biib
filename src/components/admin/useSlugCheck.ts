"use client";

import { useRef, useState } from "react";

import { suggestSlug } from "@/lib/admin/actions/news";

export interface SlugCheck {
  /** Tekshirilgan havola va birinchi boʻsh varianti (null: hech biri boʻsh emas yoki xato). */
  readonly result: { readonly slug: string; readonly free: string | null } | null;
  /** Havola oʻzgarganda chaqiriladi: 400 ms tinchlikdan keyin serverda tekshiriladi. */
  readonly schedule: (slug: string) => void;
}

const DELAY_MS = 400;

/**
 * Havolaning bandligini jonli tekshirish. Natija qaysi havola uchunligini oʻzi saqlaydi: chaqiruvchi
 * uni joriy havola bilan solishtiradi, eskirgan javob koʻrsatilmaydi.
 */
export function useSlugCheck(ownId: string | null): SlugCheck {
  const [result, setResult] = useState<SlugCheck["result"]>(null);
  const timer = useRef<number | undefined>(undefined);

  function schedule(slug: string): void {
    window.clearTimeout(timer.current);
    if (!slug) return;
    timer.current = window.setTimeout(() => {
      void suggestSlug(slug, ownId)
        .then((free) => setResult({ slug, free }))
        .catch(() => setResult({ slug, free: null }));
    }, DELAY_MS);
  }

  return { result, schedule };
}
