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
  /** Videoga kiritilgan belgining kadrdagi nisbiy qutisi (HERO_LOGO_BOX). */
  readonly logoBox: LogoBox;
  /** Media kadri, px: cover hisobi uchun. */
  readonly media: { readonly width: number; readonly height: number };
  /** Belgi videoda yigʻilmaguncha uchish kutadi, video esa tezlashib oxirigacha oʻynaydi. */
  readonly gate?: HeroGate;
}

export interface HeroGate {
  readonly open: () => boolean;
  /** Eshik ochilganda chaqiriladi; qaytgan funksiya obunani bekor qiladi. */
  readonly subscribe: (listener: () => void) => () => void;
}

export interface HeroScene {
  /** 0–1, har kadrda yangilanadi; qayta chizishga sabab boʻlmasligi uchun ref orqali oʻqiladi. */
  readonly progress: RefObject<number>;
}

interface RestRect {
  readonly left: number;
  readonly top: number;
  readonly size: number;
}

/* Sarlavhada belgining ikki nusxasi bor (kompyuter va telefon paneli), koʻrinib turgani olinadi. */
function visibleBrandMark(): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(".site-header [data-brand-mark]")) {
    if (el.getBoundingClientRect().width > 0) return el;
  }
  return null;
}

/** Sahna uzunligi CSS dan olinadi: 0 boʻlsa sahna yoʻq (kamaytirilgan harakat, past ekran). */
function cssSceneLength(wrapper: HTMLElement, fallback: number): number {
  const raw = parseFloat(getComputedStyle(wrapper).getPropertyValue("--hero-scene-length"));
  return Number.isFinite(raw) ? raw : fallback;
}

/**
 * Qahramon ustidagi skrollga bogʻlangan sahna (scrub 0.8, mahkamlashsiz). Uchish video belgini yigʻib boʻlgach
 * boshlanadi: erta skrollda video tezlashadi, keyin sahna skroll joyiga yumshoq yetib oladi va chala qolmaydi.
 * Qiymatlar funksiya koʻrinishida, har qayta hisoblashda yangidan oʻlchanadi (Flip ishlatilmaydi).
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
      const content = wrapper.querySelector<HTMLElement>("[data-hero-content]");
      const logo = wrapper.querySelector<HTMLElement>("[data-hero-logo]");
      const mark = visibleBrandMark();
      const layers = [...media, content, logo].filter((el): el is HTMLElement => el !== null);

      // Sahna faqat qahramon bitta ekranga sigʻganda: baland qahramon yopishganda pastki qismi yashirinib qolardi.
      const runnable = (): boolean => {
        const length = cssSceneLength(wrapper, fallbackLength);
        return length > 0 && length <= maxLength && hero.offsetHeight <= window.innerHeight + 1;
      };

      /* Dvigatelsiz zaxira boʻlgan CSS skroll animatsiyasi oʻchadi: belgini endi GSAP boshqaradi. */
      html.dataset.heroScene = "js";
      /* Belgi qahramonda turganda telefon panelidagi oyna faqat oʻng guruhni oʻraydi (layout.css, .top-bar). */
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
        setAway(false);
        if (mark) gsap.set(mark, { autoAlpha: 1 });
      };
      /* Sahna geometriya sababli oʻchsa, CSS ham sahnasiz joylashuvga oʻtadi (home.css, data-hero-static):
         qahramon yopishmaydi va missiya uning ustidan oʻtmaydi. */
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
        for (const el of layers) el.style.removeProperty("will-change");
      };

      /* Qahramon yopishganda belgi (0,0) nuqtada turadi, shuning uchun koordinata ekranga nisbatan olinadi. */
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
      if (content)
        tl.fromTo(content, { y: 0, autoAlpha: 1 }, { y: -48, autoAlpha: 0, duration: 0.45 }, 0.1);
      /* Belgi koʻchganda kadr eriydi va ostidan bir xil rangdagi zamin chiqadi, sahna oxirida ikkita belgi koʻrinmaydi.
         Parda ishlatilmaydi: video rangi brauzerga qarab CSS rangidan biroz farq qiladi, Safari brauzerida dogʻ qolardi. */
      if (media.length) tl.fromTo(media, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0.08);
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
      /* Qahramon hozir sigʻmasa ham sahna oʻchiq holda quriladi va shriftlar kelib sigʻsa yoqiladi:
         aks holda telefonda birinchi kadrdagi zaxira shrift sahnani butunlay oʻchirib qoʻyardi. */
      let geometryOff = !runnable();
      const gate = options.gate;
      /* Vaqt chizigʻi skroll ulushiga yumshoq ergashadi; eshik yopiq ekan uchish 0 da kutadi. */
      let scrollProgress = 0;
      let drive: gsap.core.Tween | null = null;
      /* Trigger eng oxirida yaratiladi: ScrollTrigger yaratilish paytida ham qayta hisoblash chaqirishi mumkin,
         shuning uchun barcha yordamchilar oldindan aniqlangan va trigger yoʻqligini koʻtara oladi. */
      let trigger: ScrollTrigger | null = null;
      const aim = (): number => (!gate || gate.open() ? scrollProgress : 0);
      /* Sarlavha belgisi va telefon paneli holati vaqt chizigʻidan olinadi, shunda ular uchish bilan bir vaqtda oʻzgaradi. */
      const report = (): void => {
        const p = tl.progress();
        progress.current = p;
        setAway(p < 0.76);
      };
      tl.eventCallback("onUpdate", report);
      const render = (p: number, smooth: boolean): void => {
        drive?.kill();
        drive = null;
        if (smooth && Math.abs(tl.progress() - p) > 0.0005) {
          drive = gsap.to(tl, { progress: p, duration: SCRUB, ease: "power3.out" });
        } else {
          /* Bir xil progressni qayta qoʻyish chizilmaydi, shuning uchun avval jim holda 0 ga, keyin p ga. */
          tl.progress(0, true).progress(p);
          report();
        }
      };
      const measure = (): number => {
        /* Sahifa pastda qayta yuklansa trigger hali oʻlchanmagan boʻlishi mumkin, shuning uchun oʻram joyidan hisoblanadi. */
        const fallbackStart = wrapper.getBoundingClientRect().top + window.scrollY;
        const start = trigger && Number.isFinite(trigger.start) ? trigger.start : fallbackStart;
        const end =
          trigger && Number.isFinite(trigger.end)
            ? trigger.end
            : start + wrapper.offsetHeight - window.innerHeight;
        const raw = (window.scrollY - start) / Math.max(1, end - start);
        return Math.min(1, Math.max(0, Number.isFinite(raw) ? raw : 0));
      };
      /* Sahna pastda boshlansa ham (qayta yuklash, orqaga qaytish) holat sakrashsiz turadi,
         yuqoriga qaytilganda esa belgi yana uchadi. */
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
          /* Yakuniy holatdan qaytildi (shriftlar kelib qahramon sigʻdi yoki Harakat qayta yoqildi): vaqt chizigʻi
             darhol skroll joyiga tenglashadi, belgi bir lahza ham yoʻqolmaydi. */
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
          /* Sahna oʻchiq boʻlsa (past ekran, Harakat), trigger ishlab qolganda ham belgi qimirlamaydi. */
          if (!enabled || geometryOff) return;
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
      /* Yaratish paytidagi qayta hisoblash trigger hali yoʻqligida sahnani oʻchirgan boʻlishi mumkin: holat endi
         triggerning oʻziga ham qoʻllanadi, aks holda past ekranda belgi skroll bilan uchib ketardi. */
      if (!enabled) trigger.disable(false);
      setStatic(geometryOff);
      if (geometryOff) apply();
      else syncToScroll();
      /* Qayta hisoblash tugagach holat haqiqiy skroll joyiga tenglashadi, brauzer skroll joyini sahna qurilgandan
         keyin tiklasa ham (Safari, qayta yuklash). Hisoblash paytida emas: oʻlchashda skroll vaqtincha 0 boʻladi. */
      const onRefreshed = (): void => {
        if (enabled && !geometryOff) syncToScroll();
      };
      ScrollTrigger.addEventListener("refresh", onRefreshed);
      /* Belgi yigʻildi: uchish skroll joyiga yumshoq yetib oladi. */
      const unsubscribe = gate?.subscribe(() => {
        if (enabled && !geometryOff) render(aim(), true);
      });
      /* Shrift almashishi yoki tugmalar qatori qahramon balandligini oʻzgartiradi, ScrollTrigger buni sezmaydi:
         balandlik oʻzgarsa sahna sigʻadimi yoki yoʻqmi, bir marta qayta hisoblanadi. */
      /* Oʻchiq trigger qayta hisoblashda qatnashmaydi (onRefresh chaqirilmaydi), shuning uchun geometriya
         shu yerda tekshiriladi, keyin yoqilgan trigger oʻlchamlari yangilanadi. */
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
