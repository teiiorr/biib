"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

import { REDUCED_MOTION_QUERY } from "@/lib/appearance/media";
import { whenIdle } from "@/lib/idle";
import { registerAmbient, type AmbientKind } from "@/lib/motion/ambient-governor";
import { isMotionOff } from "@/lib/motion/prefs";

export interface InViewPlaybackOptions {
  /**
   * Ambient halqa (sukut): reyestrda bir turdan bittasi ishlaydi, kamaytirilgan harakat va
   * Harakat = off da manba qoʻyilmaydi. false: foydalanuvchi boshlagan ijro — faqat yashirin
   * varaqda va koʻrinishdan chiqqanda toʻxtaydi, oʻzi qayta boshlamaydi.
   */
  readonly ambient?: boolean;
  readonly kind?: AmbientKind;
  /** Koʻrinish ulushi: shundan boshlab ijro (sukut 0.4). */
  readonly threshold?: number;
  /**
   * Bir marta ijro (qahramon videosi): oxiriga yetgach oxirgi kadrda turadi, koʻrinishga qaytganda
   * qayta boshlanmaydi; toggle uni boshidan qayta oʻynaydi.
   */
  readonly once?: boolean;
}

export interface InViewPlayback {
  /** Manba qoʻyish mumkin: kamaytirilgan harakat yoki Harakat = off boʻlsa false. */
  readonly allowed: boolean;
  readonly inView: boolean;
  /** Foydalanuvchi toʻxtatgan; toggle bilan almashadi. */
  readonly paused: boolean;
  /** once: video oxiriga yetgan (oxirgi kadrda turibdi). */
  readonly finished: boolean;
  readonly toggle: () => void;
}

/* Navigator.connection standart emas, DOM tiplarida yoʻq. */
function saveData(): boolean {
  const nav = navigator as Navigator & { readonly connection?: { readonly saveData?: boolean } };
  return nav.connection?.saveData === true;
}

/**
 * Video ijrosini koʻrinish, varaq holati va harakat sozlamalari bilan bogʻlaydi.
 * Ambient rejimda ijro sharti: ruxsat + koʻrinishda + reyestr gʻolibi + varaq ochiq + toʻxtatilmagan.
 */
export function useInViewPlayback(
  ref: RefObject<HTMLVideoElement | null>,
  { ambient = true, kind = "ambient", threshold = 0.4, once = false }: InViewPlaybackOptions = {},
): InViewPlayback {
  // Serverda va gidratsiyada false: manba faqat brauzer sozlamalari oʻqilgach qoʻyiladi.
  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(!ambient);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!once || !video) return;
    const onEnded = (): void => setFinished(true);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [ref, once]);

  useEffect(() => {
    if (!ambient) {
      queueMicrotask(() => setAllowed(true));
      return;
    }
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const apply = (): void => setAllowed(!mql.matches && !isMotionOff());
    mql.addEventListener("change", apply);
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    /* Halqa (≈ 0,9 MB) birinchi yuklanish bilan raqobatlashmaydi: manba sahifa yuklanib, brauzer
       boʻshagandan keyin qoʻyiladi; LCP posteri va skriptlar undan oldin keladi. */
    const cancelIdle = whenIdle(() => {
      apply();
      // Trafik tejash rejimida halqa oʻzi boshlanmaydi; tugma bilan yoqiladi.
      if (saveData()) setPaused(true);
    }, 2000);
    return () => {
      cancelIdle();
      mql.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, [ambient]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // isIntersecting 0 dan katta har qanday ulushda true, shuning uchun ulush solishtiriladi.
          setInView(threshold > 0 ? entry.intersectionRatio >= threshold : entry.isIntersecting);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  useEffect(() => {
    if (!ambient) return;
    const el = ref.current;
    if (!el) return;
    return registerAmbient(el, kind, {
      pause: () => setActive(false),
      resume: () => setActive(true),
    });
  }, [ref, ambient, kind]);

  useEffect(() => {
    const onVisibility = (): void => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const shouldPlay = ambient && allowed && inView && active && !hidden && !paused && !finished;
  const mustPause = !ambient && (hidden || !inView);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (ambient) {
      if (shouldPlay) void video.play().catch(() => undefined);
      else if (!video.paused) video.pause();
    } else if (mustPause && !video.paused) {
      video.pause();
    }
  }, [ref, ambient, shouldPlay, mustPause]);

  const toggle = useCallback(() => {
    if (finished) {
      // Tugagan videoni qayta koʻrish: boshidan, toʻxtatilmagan holda.
      const video = ref.current;
      if (video) video.currentTime = 0;
      setPaused(false);
      setFinished(false);
      return;
    }
    setPaused((value) => !value);
  }, [finished, ref]);

  return { allowed, inView, paused, finished, toggle };
}
