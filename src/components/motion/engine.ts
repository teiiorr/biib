"use client";

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import type { EffectCallback, RefObject } from "react";

import { enqueueSliced, viewportPriority } from "@/lib/motion/scheduler";

import type { MotionEngine } from "./engine-core";

let engine: MotionEngine | null = null;
let loading: Promise<MotionEngine> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): MotionEngine | null {
  return engine;
}

function serverSnapshot(): null {
  return null;
}

/** Dvigatel (GSAP, plaginlar, Lenis) bir marta yuklanadi; takroriy chaqiruv oʻsha vaʼdani qaytaradi. */
export function requestEngine(): Promise<MotionEngine> {
  if (engine) return Promise.resolve(engine);
  loading ??= import("./engine-core").then((mod) => {
    engine = mod.createEngine();
    listeners.forEach((listener) => listener());
    return engine;
  });
  return loading;
}

export function getEngine(): MotionEngine | null {
  return engine;
}

export function useEngine(): MotionEngine | null {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

/* React effekt shartnomasi: hech narsa yoki tozalash funksiyasi. */
type Cleanup = ReturnType<EffectCallback>;

export interface EngineEffectInfo {
  /** Dvigatel komponent chizilgandan keyin keldi: ekranda turgan narsa yashirilib qayta koʻrsatilmaydi. */
  readonly late: boolean;
  /** Kechiktirilgan tweenlar (masalan shriftlardan keyin) shu kontekstga qoʻshiladi, unmount da qaytadi. */
  readonly context: gsap.Context;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * useGSAP oʻrnini bosadi: dvigatel tayyor boʻlganda gsap.context ichida ishlaydi; bogʻliqlik
 * oʻzgarganda yoki unmount da hammasi qaytariladi. Bogʻliqliklarni chaqiruvchi beradi.
 */
export function useEngineEffect(
  scope: RefObject<Element | null>,
  effect: (engine: MotionEngine, info: EngineEffectInfo) => Cleanup,
  deps: readonly unknown[],
): void {
  const current = useEngine();
  const lateRef = useRef<boolean | null>(null);
  useIsoLayoutEffect(() => {
    if (!current) {
      lateRef.current = true;
      return;
    }
    const late = lateRef.current === true;
    lateRef.current = false;
    let cleanup: Cleanup = undefined;
    // Kontekst avval yaratiladi: gsap.context(fn) fn ni darhol chaqiradi, oʻzgaruvchi hali yoʻq boʻlardi.
    const context = current.gsap.context(() => undefined, scope.current ?? undefined);
    const start = (): void => {
      context.add(() => {
        cleanup = effect(current, { late, context });
      });
    };
    // Kech kelgan dvigatel: sahnalar kadrlarga boʻlib quriladi (uzun vazifa yoʻq), koʻrinishdagilar oldin.
    const cancel = late ? enqueueSliced(start, viewportPriority(scope.current)) : (start(), null);
    return () => {
      cancel?.();
      if (typeof cleanup === "function") cleanup();
      context.revert();
    };
  }, [current, scope, ...deps]);
}
