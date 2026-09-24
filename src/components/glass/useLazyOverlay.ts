"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";

import { whenIdle } from "@/lib/idle";

/**
 * Oddiy tugma fokusda turganida panel kelib uni almashtirsa fokus yoʻqoladi:
 * yangi tugma bir marta fokuslanadi (faqat panel yopiq boʻlsa; ochiq panel oʻzi fokus oladi).
 */
export function useFocusTrigger(ref: React.RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (enabled) ref.current?.focus({ preventScroll: true });
  }, [ref, enabled]);
}

export interface LazyOverlay<P> {
  /** Yuklangan panel komponenti; kelguncha oddiy tugma koʻrsatiladi. */
  readonly Panel: ComponentType<P> | null;
  /** Tugma ustiga kelganda yoki fokus olganda chaqiriladi: chunk oldindan olinadi. */
  readonly warm: () => void;
  /** Bosilganda: panel kelishi bilan ochiq holda chiziladi. */
  readonly openWhenReady: () => void;
  readonly wantOpen: boolean;
  /** Oddiy tugma fokusda edi: panel oʻz tugmasini fokuslashi kerak. */
  readonly restoreFocus: boolean;
}

/**
 * Radix ustidagi oyna panellari (menyu, varaq, popover) birinchi yuklanish JS ida emas:
 * sahifa yuklangach boʻsh vaqtda, tugmaga yaqinlashganda yoki bosilganda olinadi.
 */
export function useLazyOverlay<P>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  shellRef: React.RefObject<HTMLElement | null>,
): LazyOverlay<P> {
  const [Panel, setPanel] = useState<ComponentType<P> | null>(null);
  const [wantOpen, setWantOpen] = useState(false);
  const [restoreFocus, setRestoreFocus] = useState(false);
  const promise = useRef<Promise<void> | null>(null);

  const warm = useCallback(() => {
    promise.current ??= loader().then((mod) => {
      setRestoreFocus(document.activeElement === shellRef.current);
      setPanel(() => mod.default);
    });
  }, [loader, shellRef]);

  useEffect(() => whenIdle(warm, 3000), [warm]);

  const openWhenReady = useCallback(() => {
    setWantOpen(true);
    warm();
  }, [warm]);

  return { Panel, warm, openWhenReady, wantOpen, restoreFocus };
}
