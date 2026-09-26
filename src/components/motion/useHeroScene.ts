"use client";

import { useRef, type RefObject } from "react";

import type { LogoBox } from "@/content/brand";
import { registerAmbient } from "@/lib/motion/ambient-governor";
import { PIN_LENGTH, SCENE_LENGTH, SCRUB } from "@/lib/motion/constants";
import { coverRect, logoRect } from "@/lib/motion/cover";
import { motionAllowed } from "@/lib/motion/prefs";
import { isLitePerf } from "@/lib/perf";
import { reached } from "@/lib/motion/viewport";

import { useEngineEffect } from "./engine";
import { useMotionPrefs } from "./motion-context";

export interface HeroSceneOptions {
  /** Kadrga pishirilgan belgining nisbiy qutisi (HERO_LOGO_BOX). */
  readonly logoBox: LogoBox;
  /** Media kadri (px): cover hisobi uchun. */
  readonly media: { readonly width: number; readonly height: number };
}

export interface HeroScene {
  /** 0–1, har kadrda yangilanadi; render emas, ref orqali oʻqiladi. */
  readonly progress: RefObject<number>;
}

interface RestRect {
  readonly left: number;
  readonly top: number;
  readonly size: number;
}

/* Sarlavha belgisi: ikkita nusxa bor (kompyuter va telefon paneli), koʻrinayotgani olinadi. */
function visibleBrandMark(): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(".site-header [data-brand-mark]")) {
    if (el.getBoundingClientRect().width > 0) return el;
  }
  return null;
}

/** CSS dagi sahna uzunligi: 0 boʻlsa sahna yoʻq (kamaytirilgan harakat, past ekran). */
function cssSceneLength(wrapper: HTMLElement, fallback: number): number {
  const raw = parseFloat(getComputedStyle(wrapper).getPropertyValue("--hero-scene-length"));
  return Number.isFinite(raw) ? raw : fallback;
}

/**
 * hero-scene: yopishqoq qahramon ustida skrablangan sahna (scrub 0.8, pin yoʻq). Kadr belgiga
 * yaqinlashadi va xiralashadi, matn koʻtarilib ketadi, belgi kadrdan chiqib sarlavhadagi
 * belgiga qoʻnadi. Qiymatlar funksiya: refresh da qayta hisoblanadi (Flip emas, D-M2).
 */
export function useHeroScene(
  scope: RefObject<HTMLElement | null>,
  options: HeroSceneOptions,
): HeroScene {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const progress = useRef(0);
  const expanded = prefs.breakpoint === "expanded";
  const maxLength = expanded ? PIN_LENGTH.expanded : PIN_LENGTH.compact;
  const fallbackLength = expanded ? SCENE_LENGTH.hero.expanded : SCENE_LENGTH.hero.compact;

  useEngineEffect(
    scope,
    ({ gsap, ScrollTrigger }) => {
      const wrapper = scope.current;
      // Kuchsiz qurilmada sahna qurilmaydi: CSS zaxira holati (kadr joyida) qoladi.
      if (!wrapper || !allowed || isLitePerf()) return;
      const hero = wrapper.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;
      const html = document.documentElement;
      const media = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-hero-media]"));
      const dim = wrapper.querySelector<HTMLElement>("[data-hero-dim]");
      const content = wrapper.querySelector<HTMLElement>("[data-hero-content]");
      const logo = wrapper.querySelector<HTMLElement>("[data-hero-logo]");
      const veil = wrapper.querySelector<HTMLElement>("[data-hero-veil]");
      const mark = visibleBrandMark();
      const layers = [...media, dim, content, logo, veil].filter(
        (el): el is HTMLElement => el !== null,
      );

      // Sahna faqat qahramon bitta ekranga sigʻganda: baland qahramon yopishganda pastki qismi yashirinardi.
      const runnable = (): boolean => {
        const length = cssSceneLength(wrapper, fallbackLength);
        return length > 0 && length <= maxLength && hero.offsetHeight <= window.innerHeight + 1;
      };

      /* CSS skroll-animatsiyasi (dvigatelsiz zaxira) oʻchadi: belgining koʻrinishini endi GSAP boshqaradi. */
      html.dataset.heroScene = "js";
      /* Belgining sarlavhaga uchishi faqat kompyuterda: telefonda panel birinchi kadrdan toʻliq (belgi
         bilan), qahramondagi belgi kadr bilan birga qoladi — ikkita belgi koʻrinmaydi. */
      const dock = window.matchMedia("(min-width: 1024px)").matches;
      const settle = (): void => {
        progress.current = 1;
        hero.style.setProperty("--scene-progress", "1");
        if (mark) gsap.set(mark, { autoAlpha: 1 });
      };
      const release = (): void => {
        delete html.dataset.heroScene;
        hero.style.removeProperty("--scene-progress");
        for (const el of layers) el.style.removeProperty("will-change");
      };

      // Dvigatel kech keldi, foydalanuvchi allaqachon pastda: sahna statik yakuniy holatda qoladi (sakrash yoʻq).
      if (!runnable() || (reached(wrapper) && window.scrollY > window.innerHeight * 0.1)) {
        settle();
        return release;
      }

      /* Belgining tinch holati: qahramon yopishganda (0,0) da turadi, shuning uchun viewport koordinatasi. */
      const rest = (): RestRect => {
        const cover = coverRect(
          options.media.width,
          options.media.height,
          hero.clientWidth,
          hero.clientHeight,
        );
        const r = logoRect(cover, options.logoBox);
        return { left: r.cx - r.size / 2, top: r.cy - r.size / 2, size: r.size };
      };
      const target = (): DOMRect | null =>
        (visibleBrandMark() ?? mark)?.getBoundingClientRect() ?? null;
      const dx = (): number => {
        const t = target();
        const r = rest();
        return t ? t.left + t.width / 2 - (r.left + r.size / 2) : 0;
      };
      const dy = (): number => {
        const t = target();
        const r = rest();
        return t ? t.top + t.height / 2 - (r.top + r.size / 2) : -(r.top + r.size);
      };
      const scaleTo = (): number => {
        const t = target();
        const r = rest();
        return t && r.size > 0 ? t.width / r.size : 0.2;
      };

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      if (media.length)
        tl.fromTo(media, { scale: 1 }, { scale: 1.12, transformOrigin: "50% 42%", duration: 1 }, 0);
      if (dim) tl.fromTo(dim, { opacity: 0 }, { opacity: 0.72, duration: 0.7 }, 0);
      if (content)
        tl.fromTo(content, { y: 0, autoAlpha: 1 }, { y: -48, autoAlpha: 0, duration: 0.45 }, 0.1);
      // Parda kadrdagi doirani belgi koʻchishidan oldin yopadi: sahna oxirida ikkita belgi koʻrinmaydi.
      if (dock && veil) tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.08);
      if (dock && logo) {
        tl.fromTo(
          logo,
          { autoAlpha: 0, x: 0, y: 0, scale: 1 },
          { autoAlpha: 1, duration: 0.1 },
          0.05,
        );
        tl.to(logo, { x: dx, y: dy, scale: scaleTo, duration: 0.6 }, 0.15);
        tl.to(logo, { autoAlpha: 0, duration: 0.08 }, 0.72);
      }
      if (dock && mark) tl.fromTo(mark, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.72);

      let enabled = true;
      let governorOff = false;
      let geometryOff = false;
      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB,
        animation: tl,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          for (const el of layers) {
            if (self.isActive) el.style.setProperty("will-change", "transform, opacity");
            else el.style.removeProperty("will-change");
          }
        },
        onUpdate: (self) => {
          progress.current = self.progress;
          hero.style.setProperty("--scene-progress", self.progress.toFixed(3));
        },
        onRefresh: () => {
          geometryOff = !runnable();
          apply();
        },
      });
      const apply = (): void => {
        const on = !governorOff && !geometryOff;
        if (on === enabled) return;
        enabled = on;
        if (on) trigger.enable(false, false);
        else {
          const reachedAt = trigger.progress;
          trigger.disable(false);
          /* Tez skroll yoki langarga sakrashda scrub orqada qoladi: sahna toʻxtaganda holat skroll joyiga
             tenglashadi, aks holda sarlavhadagi belgi yashirin qolib ketardi. */
          tl.progress(reachedAt);
          progress.current = reachedAt;
          if (geometryOff) {
            tl.progress(0);
            settle();
          }
        }
      };
      const unregister = registerAmbient(wrapper, "scene", {
        pause: () => {
          governorOff = true;
          apply();
        },
        resume: () => {
          governorOff = false;
          apply();
        },
      });

      return () => {
        unregister();
        trigger.kill();
        tl.kill();
        release();
      };
    },
    [allowed, options.logoBox, options.media, maxLength, fallbackLength],
  );

  return { progress };
}
