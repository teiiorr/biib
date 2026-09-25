"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { DARK_SCHEME_QUERY, readStorage } from "./dom";
import { useReducedMotion, useReducedTransparency } from "./media";
import {
  getAppearanceSnapshot,
  getServerAppearanceSnapshot,
  refreshSystemTheme,
  replaceAppearance,
  resetAppearance,
  setAppearance,
  subscribeAppearance,
} from "./store";
import { setTheme, type ThemeOrigin } from "./transitions";
import { STORAGE_KEY, type Appearance, type ResolvedTheme, type ThemeChoice } from "./types";

export interface AppearanceValue {
  readonly appearance: Appearance;
  readonly resolvedTheme: ResolvedTheme;
  /** Tizimda shaffoflik kamaytirilgan: material qattiq, sozlagichlar oʻchiq. */
  readonly reducedTransparency: boolean;
  readonly reducedMotion: boolean;
  readonly set: (patch: Partial<Appearance>) => void;
  readonly setTheme: (next: ThemeChoice, origin?: ThemeOrigin) => void;
  readonly reset: () => void;
}

const AppearanceContext = createContext<AppearanceValue | null>(null);

function useAppearanceValue(): AppearanceValue {
  const snapshot = useSyncExternalStore(
    subscribeAppearance,
    getAppearanceSnapshot,
    getServerAppearanceSnapshot,
  );
  const reducedTransparency = useReducedTransparency();
  const reducedMotion = useReducedMotion();
  return useMemo(
    () => ({
      appearance: snapshot.appearance,
      resolvedTheme: snapshot.resolvedTheme,
      reducedTransparency,
      reducedMotion,
      set: (patch) => {
        setAppearance(patch);
      },
      setTheme,
      reset: () => {
        resetAppearance();
      },
    }),
    [snapshot, reducedTransparency, reducedMotion],
  );
}

export function AppearanceProvider({ children }: { readonly children: ReactNode }) {
  const value = useAppearanceValue();

  useEffect(() => {
    const media = window.matchMedia(DARK_SCHEME_QUERY);
    media.addEventListener("change", refreshSystemTheme);
    const onStorage = (event: StorageEvent): void => {
      if (event.key === STORAGE_KEY) replaceAppearance(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", refreshSystemTheme);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

/** Provider boʻlmasa ham ishlaydi: doʻkon modul darajasida, kontekst faqat qulaylik. */
export function useAppearance(): AppearanceValue {
  const fromContext = useContext(AppearanceContext);
  const direct = useAppearanceValue();
  return fromContext ?? direct;
}
