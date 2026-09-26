"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { readStorage } from "./dom";
import { useReducedMotion, useReducedTransparency } from "./media";
import {
  getAppearanceSnapshot,
  getServerAppearanceSnapshot,
  replaceAppearance,
  resetAppearance,
  setAppearance,
  subscribeAppearance,
} from "./store";
import { STORAGE_KEY, type Appearance } from "./types";

export interface AppearanceValue {
  readonly appearance: Appearance;
  /** Tizimda shaffoflik kamaytirilgan: material qattiq, sozlagichlar oʻchiq. */
  readonly reducedTransparency: boolean;
  readonly reducedMotion: boolean;
  readonly set: (patch: Partial<Appearance>) => void;
  readonly reset: () => void;
}

const AppearanceContext = createContext<AppearanceValue | null>(null);

function useAppearanceValue(): AppearanceValue {
  const appearance = useSyncExternalStore(
    subscribeAppearance,
    getAppearanceSnapshot,
    getServerAppearanceSnapshot,
  );
  const reducedTransparency = useReducedTransparency();
  const reducedMotion = useReducedMotion();
  return useMemo(
    () => ({
      appearance,
      reducedTransparency,
      reducedMotion,
      set: (patch) => {
        setAppearance(patch);
      },
      reset: () => {
        resetAppearance();
      },
    }),
    [appearance, reducedTransparency, reducedMotion],
  );
}

export function AppearanceProvider({ children }: { readonly children: ReactNode }) {
  const value = useAppearanceValue();

  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key === STORAGE_KEY) replaceAppearance(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => {
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
