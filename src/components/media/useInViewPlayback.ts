"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

import { REDUCED_MOTION_QUERY } from "@/lib/appearance/media";
import { whenIdle } from "@/lib/idle";
import { registerAmbient, type AmbientKind } from "@/lib/motion/ambient-governor";
import { isMotionOff } from "@/lib/motion/prefs";

export interface InViewPlaybackOptions {
  /**
   * Fon halqasi (odatiy): reyestrda bir turdan faqat bittasi ishlaydi; kamaytirilgan harakatda va Harakat
   * oʻchiq boʻlsa manba qoʻyilmaydi. false: foydalanuvchi oʻzi boshlagan ijro, u faqat varaq yashirinsa yoki
   * ekrandan chiqsa toʻxtaydi va oʻz-oʻzidan qayta boshlanmaydi.
   */
  readonly ambient?: boolean;
  readonly kind?: AmbientKind;
  /** Ijro boshlanadigan koʻrinish ulushi (odatda 0.4). */
  readonly threshold?: number;
  /**
   * Bir marta ijro (qahramon videosi): oxirgi kadrda toʻxtaydi, ekranga qaytganda qayta boshlanmaydi;
   * toggle uni boshidan oʻynaydi.
   */
  readonly once?: boolean;
}

export interface InViewPlayback {
  /** Kamaytirilgan harakatda yoki Harakat oʻchiq boʻlsa false, manba qoʻyilmaydi. */
  readonly allowed: boolean;
  /** Ruxsat brauzer boʻshaganda (koʻpi bilan 2 s) bir marta aniqlanadi; shungacha allowed=false «hali nomaʼlum» degani. */
  readonly settled: boolean;
  readonly inView: boolean;
  readonly paused: boolean;
  readonly finished: boolean;
  readonly toggle: () => void;
}

/* Navigator.connection standart emas, DOM tiplarida yoʻq. */
function saveData(): boolean {
  const nav = navigator as Navigator & { readonly connection?: { readonly saveData?: boolean } };
  return nav.connection?.saveData === true;
}

/** Fon rejimida ijro sharti: ruxsat bor, ekranda, reyestrda gʻolib, varaq ochiq va foydalanuvchi toʻxtatmagan. */
export function useInViewPlayback(
  ref: RefObject<HTMLVideoElement | null>,
  { ambient = true, kind = "ambient", threshold = 0.4, once = false }: InViewPlaybackOptions = {},
): InViewPlayback {
  // Serverda va gidratsiyada false: manba faqat brauzer sozlamalari oʻqilgach qoʻyiladi.
  const [allowed, setAllowed] = useState(false);
  const [settled, setSettled] = useState(false);
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
      queueMicrotask(() => {
        setAllowed(true);
        setSettled(true);
      });
      return;
    }
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const apply = (): void => {
      setAllowed(!mql.matches && !isMotionOff());
      setSettled(true);
    };
    mql.addEventListener("change", apply);
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    /* Halqa (taxminan 0,9 MB) birinchi yuklanish bilan raqobatlashmasin: manba sahifa yuklanib, brauzer
       boʻshagandan keyin qoʻyiladi, LCP posteri va skriptlar undan oldin keladi. */
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
      const video = ref.current;
      if (video) video.currentTime = 0;
      setPaused(false);
      setFinished(false);
      return;
    }
    setPaused((value) => !value);
  }, [finished, ref]);

  return { allowed, settled, inView, paused, finished, toggle };
}
