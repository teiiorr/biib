"use client";

import { useRef, type RefObject } from "react";

import type { LogoBox } from "@/content/brand";
import { registerAmbient } from "@/lib/motion/ambient-governor";
import { PIN_LENGTH, SCENE_LENGTH, SCRUB } from "@/lib/motion/constants";
import { HERO_FOCUS_Y, coverRect, heroMediaBox, logoRect } from "@/lib/motion/cover";
import { motionAllowed } from "@/lib/motion/prefs";
import { scheduleScrollRefresh } from "@/lib/motion/refresh";

import { useEngineEffect } from "./engine";
import { useMotionPrefs } from "./motion-context";

export interface HeroSceneOptions {
  /** Kadrga pishirilgan belgining nisbiy qutisi (HERO_LOGO_BOX). */
  readonly logoBox: LogoBox;
  /** Media kadri (px): cover hisobi uchun. */
  readonly media: { readonly width: number; readonly height: number };
  /** Belgi kadrda yigʻildimi: yigʻilmaguncha uchish kutadi (video tezlashib oxirigacha oʻynaydi). */
  readonly gate?: HeroGate;
}

export interface HeroGate {
  readonly open: () => boolean;
  /** Eshik ochilganda chaqiriladi; qaytgan funksiya obunani bekor qiladi. */
  readonly subscribe: (listener: () => void) => () => void;
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
 * hero-scene: yopishqoq qahramon ustida skrablangan sahna (scrub 0.8, pin yoʻq). Uchish faqat video
 * belgini yigʻib boʻlgach boshlanadi (gate): erta skrollda video tezlashadi, belgi toʻliq yigʻiladi,
 * keyin sahna skroll joyiga yumshoq yetib oladi — animatsiya hech qachon chala qolmaydi. Kadr belgiga
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
      if (!wrapper || !allowed) return;
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
      /* Telefon paneli: belgi qahramonda ekan oyna faqat oʻng guruhni oʻraydi (layout.css .top-bar). */
      const topBar = document.querySelector<HTMLElement>("[data-top-bar]");
      const topGroup = topBar?.querySelector<HTMLElement>("[data-top-bar-group]");
      if (topBar && topGroup) {
        topBar.style.setProperty("--top-bar-group-w", `${Math.ceil(topGroup.offsetWidth + 16)}px`);
      }
      const setAway = (away: boolean): void => {
        if (away) html.dataset.brandAway = "";
        else delete html.dataset.brandAway;
      };
      const settle = (): void => {
        progress.current = 1;
        hero.style.setProperty("--scene-progress", "1");
        setAway(false);
        if (mark) gsap.set(mark, { autoAlpha: 1 });
      };
      /* Sahna geometriya sababli oʻchsa CSS ham sahnasiz joylashuvga oʻtadi (home.css data-hero-static):
         qahramon yopishmaydi, missiya uning ustidan oʻtmaydi. */
      const setStatic = (on: boolean): void => {
        if (on === "heroStatic" in html.dataset) return;
        if (on) html.dataset.heroStatic = "";
        else delete html.dataset.heroStatic;
        scheduleScrollRefresh();
      };
      const release = (): void => {
        delete html.dataset.heroScene;
        delete html.dataset.heroStatic;
        setAway(false);
        hero.style.removeProperty("--scene-progress");
        for (const el of layers) el.style.removeProperty("will-change");
      };

      /* Belgining tinch holati: qahramon yopishganda (0,0) da turadi, shuning uchun viewport koordinatasi. */
      const rest = (): RestRect => {
        const box = heroMediaBox(hero);
        const cover = coverRect(
          options.media.width,
          options.media.height,
          box.width,
          box.height,
          HERO_FOCUS_Y,
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
      if (veil) tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.08);
      if (logo) {
        tl.fromTo(
          logo,
          { autoAlpha: 0, x: 0, y: 0, scale: 1 },
          { autoAlpha: 1, duration: 0.1 },
          0.05,
        );
        tl.to(logo, { x: dx, y: dy, scale: scaleTo, duration: 0.6 }, 0.15);
        tl.to(logo, { autoAlpha: 0, duration: 0.08 }, 0.72);
      }
      if (mark) tl.fromTo(mark, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.72);

      setAway(true);
      let enabled = true;
      let governorOff = false;
      /* Qahramon hozir ekranga sigʻmasa ham sahna quriladi, faqat oʻchiq: shriftlar yuklangach (refresh)
         sigʻsa yoqiladi. Aks holda birinchi kadrdagi zaxira shrift telefonda sahnani butunlay oʻchirardi. */
      let geometryOff = !runnable();
      const gate = options.gate;
      /* Skroll ulushi (xom) va vaqt chizigʻi unga yumshoq ergashadi; eshik yopiq ekan uchish 0 da kutadi. */
      let scrollProgress = 0;
      let drive: gsap.core.Tween | null = null;
      /* Trigger oxirida yaratiladi: ScrollTrigger refresh ni yaratish paytida ham chaqirishi mumkin, shu
         sabab hamma yordamchi undan oldin aniqlangan va trigger yoʻqligini koʻtara oladi. */
      let trigger: ScrollTrigger | null = null;
      const aim = (): number => (!gate || gate.open() ? scrollProgress : 0);
      /* Koʻrinayotgan holat vaqt chizigʻidan: sarlavha belgisi va telefon paneli uchish bilan bir vaqtda. */
      const report = (): void => {
        const p = tl.progress();
        progress.current = p;
        hero.style.setProperty("--scene-progress", p.toFixed(3));
        setAway(p < 0.76);
      };
      tl.eventCallback("onUpdate", report);
      const render = (p: number, smooth: boolean): void => {
        drive?.kill();
        drive = null;
        if (smooth && Math.abs(tl.progress() - p) > 0.0005) {
          drive = gsap.to(tl, { progress: p, duration: SCRUB, ease: "power3.out" });
        } else {
          /* Bir xil progressga qayta qoʻyish chizilmaydi: avval jim holda 0 ga, keyin p ga. */
          tl.progress(0, true).progress(p);
          report();
        }
      };
      const measure = (): number => {
        /* Trigger hali oʻlchanmagan boʻlishi mumkin (sahifa pastda qayta yuklandi): oʻram joyidan hisoblanadi. */
        const fallbackStart = wrapper.getBoundingClientRect().top + window.scrollY;
        const start = trigger && Number.isFinite(trigger.start) ? trigger.start : fallbackStart;
        const end =
          trigger && Number.isFinite(trigger.end)
            ? trigger.end
            : start + wrapper.offsetHeight - window.innerHeight;
        const raw = (window.scrollY - start) / Math.max(1, end - start);
        return Math.min(1, Math.max(0, Number.isFinite(raw) ? raw : 0));
      };
      /* Skroll joyidagi holat: sahna pastda boshlansa ham (qayta yuklash, orqaga qaytish) sakrashsiz
         turadi va yuqoriga qaytganda belgi yana uchadi. */
      const syncToScroll = (): void => {
        scrollProgress = measure();
        render(aim(), false);
      };
      const apply = (): void => {
        const on = !governorOff && !geometryOff;
        if (on === enabled) return;
        enabled = on;
        if (on) {
          trigger?.enable(false, false);
          /* Yakuniy holatdan qaytildi (shriftlar kelib qahramon sigʻdi, Harakat qayta yoqildi): vaqt
             chizigʻi darhol skroll joyiga tenglashadi — belgi bir lahza ham yoʻqolmaydi. */
          syncToScroll();
        } else {
          drive?.kill();
          drive = null;
          trigger?.disable(false);
          if (geometryOff) {
            tl.progress(0);
            settle();
          }
        }
      };
      const checkGeometry = (): void => {
        geometryOff = !runnable();
        setStatic(geometryOff);
        apply();
        if (geometryOff) {
          tl.progress(0);
          settle();
        }
      };
      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onToggle: (self) => {
          for (const el of layers) {
            if (self.isActive) el.style.setProperty("will-change", "transform, opacity");
            else el.style.removeProperty("will-change");
          }
        },
        onUpdate: (self) => {
          scrollProgress = self.progress;
          render(aim(), true);
        },
        onRefresh: () => {
          /* Oʻlchamga bogʻliq qiymatlar (belgining nishoni) qayta hisoblanadi, holat joyida qoladi. */
          const p = tl.progress();
          tl.invalidate();
          tl.progress(0, true).progress(p, true);
          checkGeometry();
        },
      });
      setStatic(geometryOff);
      if (geometryOff) apply();
      else syncToScroll();
      /* Refresh tugagach (shriftlar, media) holat haqiqiy skroll joyiga tenglashadi: brauzer skroll joyini
         sahna qurilgandan keyin tiklasa ham (Safari, qayta yuklash). Refresh paytida emas — oʻlchash
         vaqtida skroll vaqtincha 0 boʻladi. */
      const onRefreshed = (): void => {
        if (enabled && !geometryOff) syncToScroll();
      };
      ScrollTrigger.addEventListener("refresh", onRefreshed);
      /* Belgi yigʻildi: uchish skroll joyiga yumshoq yetib oladi. */
      const unsubscribe = gate?.subscribe(() => {
        if (enabled && !geometryOff) render(aim(), true);
      });
      /* Shrift almashishi yoki tugmalar qatori qahramon balandligini oʻzgartiradi; ScrollTrigger buni
         oʻzi sezmaydi. Balandlik oʻzgarsa bitta refresh: sahna sigʻdimi yoki yoʻqmi qayta hisoblanadi. */
      /* Oʻchiq trigger refreshda qatnashmaydi (onRefresh chaqirilmaydi): shu sabab geometriya shu yerda
         toʻgʻridan-toʻgʻri qayta tekshiriladi, keyin yoqilgan trigger oʻlchamlari yangilanadi. */
      let heroHeight = hero.offsetHeight;
      const heroResize = new ResizeObserver(() => {
        if (hero.offsetHeight === heroHeight) return;
        heroHeight = hero.offsetHeight;
        checkGeometry();
        scheduleScrollRefresh();
      });
      heroResize.observe(hero);
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
        unsubscribe?.();
        drive?.kill();
        ScrollTrigger.removeEventListener("refresh", onRefreshed);
        heroResize.disconnect();
        unregister();
        trigger?.kill();
        tl.kill();
        release();
      };
    },
    [allowed, options.logoBox, options.media, options.gate, maxLength, fallbackLength],
  );

  return { progress };
}
