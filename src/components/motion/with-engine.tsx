"use client";

import { useEffect, useState, type ComponentType } from "react";

import { motionAllowed } from "@/lib/motion/prefs";

import { getEngine, useEngine } from "./engine";
import { useMotionPrefs } from "./motion-context";

export interface LateProps {
  /** Dvigatel barg oʻrnatilgandan keyin keldi (sovuq yuklash): ekrandagi narsa sakramasligi kerak. */
  readonly late: boolean;
}

/**
 * Faqat harakat uchun kerak boʻlgan barg (UPOP sahnasi, media ochilishi, futer kirishi) birinchi
 * yuklamaga kirmaydi: dvigatel kelgach va harakat ruxsat etilsa alohida chunk sifatida olinadi.
 * Barg hech narsa koʻrsatmaydi (yashirin langar). Suspense ishlatilmaydi: uning ochilishi React da
 * sahifa View Transition ini ishga tushirardi — oddiy holat yangilanishi oʻtishsiz.
 */
export function withEngine<P extends object>(
  load: () => Promise<{ default: ComponentType<P & LateProps> }>,
): ComponentType<P> {
  let loaded: ComponentType<P & LateProps> | null = null;
  function EngineGate(props: P) {
    const engine = useEngine();
    const prefs = useMotionPrefs();
    const allowed = prefs.ready && motionAllowed(prefs);
    const [Impl, setImpl] = useState<ComponentType<P & LateProps> | null>(() => loaded);
    // Birinchi chizishda dvigatel yoʻq boʻlsa — kech keldi (gidratsiyada doim shunday).
    const [late] = useState(() => getEngine() === null);

    useEffect(() => {
      if (!engine || !allowed || Impl) return;
      let cancelled = false;
      void load().then((mod) => {
        loaded = mod.default;
        if (!cancelled) setImpl(() => mod.default);
      });
      return () => {
        cancelled = true;
      };
    }, [engine, allowed, Impl]);

    if (!engine || !allowed || !Impl) return null;
    return <Impl {...props} late={late} />;
  }
  return EngineGate;
}
