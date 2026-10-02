"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";

import { whenIdle } from "@/lib/idle";

/**
 * Panel kelib fokusdagi oddiy tugmani almashtirsa fokus yoʻqoladi, shu sabab yangi tugma bir marta
 * fokuslanadi. Ochiq panel fokusni oʻzi oladi.
 */
export function useFocusTrigger(ref: React.RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (enabled) ref.current?.focus({ preventScroll: true });
  }, [ref, enabled]);
}

export interface LazyOverlay<P> {
  /** null boʻlsa hozircha oddiy tugma koʻrsatiladi. */
  readonly Panel: ComponentType<P> | null;
  /** Ustiga kelganda yoki fokusda chunk oldindan olinadi. */
  readonly warm: () => void;
  readonly openWhenReady: () => void;
  readonly wantOpen: boolean;
  /** Oddiy tugma fokusda edi: panel oʻz tugmasini fokuslashi kerak. */
  readonly restoreFocus: boolean;
}

/**
 * Radix panellari birinchi yuklanadigan skriptga kirmaydi: brauzer boʻshaganda, tugmaga
 * yaqinlashganda yoki bosilganda olinadi.
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
