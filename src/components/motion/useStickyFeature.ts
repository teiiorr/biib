"use client";

import { useRef, type RefObject } from "react";

import { registerAmbient } from "@/lib/motion/ambient-governor";
import { DURATION, EASE, SCRUB } from "@/lib/motion/constants";
import { doiraStaggerFn, doiraUnit } from "@/lib/motion/doira";
import { motionAllowed } from "@/lib/motion/prefs";
import { belowViewport, reached } from "@/lib/motion/viewport";
import { watchPending } from "@/lib/motion/watchdog";

import { useEngineEffect } from "./engine";
import type { MotionEngine } from "./engine-core";
import { buildMediaReveal, buildParallax, mediaTargets } from "./media-motion";
import { useMotionPrefs } from "./motion-context";
import { useParallaxDepth } from "./useMediaParallax";

interface FeatureParts {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly grid: HTMLElement;
  readonly wordmark: HTMLElement;
  readonly media: HTMLElement;
  readonly text: HTMLElement;
  readonly head: HTMLElement | null;
  readonly items: readonly HTMLElement[];
  readonly actions: HTMLElement | null;
  readonly dim: HTMLElement | null;
  readonly control: HTMLElement | null;
}

/* Sahna pastidagi boʻshliq, motion.css faylidagi padding-bottom bilan bir xil. */
const STAGE_BOTTOM = 8;

interface Placement {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

function queryParts(root: HTMLElement): FeatureParts | null {
  const stage = root.querySelector<HTMLElement>("[data-upop-stage]");
  const grid = stage?.querySelector<HTMLElement>(".upop-feature-grid");
  const wordmark = root.querySelector<HTMLElement>("[data-upop-wordmark]");
  const media = root.querySelector<HTMLElement>("[data-upop-media]");
  const text = root.querySelector<HTMLElement>("[data-upop-text]");
  if (!stage || !grid || !wordmark || !media || !text) return null;
  return {
    root,
    stage,
    grid,
    wordmark,
    media,
    text,
    head: root.querySelector<HTMLElement>(".upop-feature-head"),
    items: Array.from(text.querySelectorAll<HTMLElement>(".upop-feature-list > li")),
    actions: text.querySelector<HTMLElement>(".upop-feature-actions"),
    dim: media.querySelector<HTMLElement>("[data-upop-dim]"),
    control: media.querySelector<HTMLElement>(".media-video-control"),
  };
}

/* Joy offsetParent zanjiri boʻyicha hisoblanadi, shunda transform natijaga taʼsir qilmaydi. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): { left: number; top: number } {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { left, top };
}

/* Element markazini sahna markaziga olib boruvchi siljish va berilgan masshtab. */
function centreOn(el: HTMLElement, stage: HTMLElement, scale: number): Placement {
  const { left, top } = offsetWithin(el, stage);
  return {
    x: stage.clientWidth / 2 - (left + el.offsetWidth / 2),
    y: stage.clientHeight / 2 - (top + el.offsetHeight / 2),
    scale,
  };
}

/**
 * Kompyuter sahnasi: kadr avval butun sahnani qoplaydi, skroll bilan kadr va logotip oʻz katagiga qoʻnadi.
 * Foydalanuvchi allaqachon shu yerda boʻlsa null qaytadi. Kontent sigʻmasa sahna yakuniy holatda kutadi
 * va har qayta hisoblashda yana tekshiriladi (masalan, shriftlar kelgach).
 */
function buildScene(
  { gsap, ScrollTrigger }: MotionEngine,
  parts: FeatureParts,
  late: boolean,
  progress: { current: number },
): (() => void) | null {
  const { root, stage, grid, wordmark, media, head, items, actions, dim, control } = parts;
  if (late && reached(root)) return null;
  /* Oʻlchamsiz kadr cheksiz «cover» masshtabini berib, sahifa boshini qoplab qoʻyardi. */
  if (media.offsetWidth === 0 || media.offsetHeight === 0 || wordmark.offsetHeight === 0)
    return null;
  // Sigʻishi sahna holatini yoqmasdan oʻlchanadi: toʻr balandligi sahnaga bogʻliq emas.
  const fits = (): boolean => {
    const header = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 64;
    return grid.offsetHeight <= window.innerHeight - (header + 12) - STAGE_BOTTOM;
  };
  /* Sigʻmasa sahna umuman qurilmaydi: aks holda «cover» holati qolib, sahifa boshini qoplardi
     (skroll silliqlash tweeni progress(1) ni qaytadan 0 ga olib borardi). */
  if (!fits()) {
    delete root.dataset.scene;
    return null;
  }
  let geometryOff = false;
  const place = (): void => {
    if (geometryOff) delete root.dataset.scene;
    else root.dataset.scene = "on";
  };
  place();

  const cover = (): Placement => {
    const scale = Math.max(
      stage.clientWidth / media.offsetWidth,
      stage.clientHeight / media.offsetHeight,
    );
    return centreOn(media, stage, scale);
  };
  // Logotip sahna balandligining 60 % idan oshmaydi, aks holda sarlavha ekrandan chiqib ketadi.
  const title = (): Placement =>
    centreOn(
      wordmark,
      stage,
      Math.min(1.6, (stage.clientHeight * 0.6) / Math.max(1, wordmark.offsetHeight)),
    );

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.none } });
  tl.fromTo(
    media,
    { x: () => cover().x, y: () => cover().y, scale: () => cover().scale },
    { x: 0, y: 0, scale: 1, duration: 0.5, ease: EASE.inOut },
    0,
  ).fromTo(
    wordmark,
    { x: () => title().x, y: () => title().y, scale: () => title().scale },
    { x: 0, y: 0, scale: 1, duration: 0.5, ease: EASE.inOut },
    0,
  );
  if (dim) tl.fromTo(dim, { opacity: 0.45 }, { opacity: 0, duration: 0.5 }, 0);
  // 44 px boshqaruv tugmasi kadr bilan birga kattalashmasin: u kadr qoʻngandan keyin paydo boʻladi.
  if (control) tl.fromTo(control, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.45);
  if (head) {
    tl.fromTo(
      head,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.3, ease: EASE.out },
      0.4,
    );
  }
  if (items.length > 0) {
    // Boshlangʻich holat hamma dalilga beriladi: pogʻonali fromTo faqat birinchisini darhol yashirardi.
    gsap.set(items, { y: 32, autoAlpha: 0 });
    tl.fromTo(
      items,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.25, ease: EASE.out, stagger: doiraStaggerFn(0.04) },
      0.45,
    );
  }
  if (actions) {
    tl.fromTo(
      actions,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.2, ease: EASE.out },
      0.75,
    );
  }
  // Oxirgi 5 % da sahna tinch turadi, keyin boʻshaydi.
  tl.set({}, {}, 1);

  const layers = [media, wordmark];
  let enabled = true;
  let governorOff = false;
  let trigger: ScrollTrigger | null = null;
  // Kontent sahnaga sigʻmasa (shrift hali kelmagan, past oyna): sahna yakuniy (CSS) holatda qotadi.
  const apply = (): void => {
    const on = !governorOff && !geometryOff;
    if (on === enabled || !trigger) return;
    enabled = on;
    if (on) {
      trigger.enable(false, false);
      return;
    }
    trigger.disable(false);
    // Scrub tweeni ham toʻxtatiladi, aks holda u sahnani yana boshlangʻich holatga qaytaradi.
    gsap.killTweensOf(tl);
    if (geometryOff) tl.progress(1);
  };
  // Sigʻish qayta hisoblashdan oldin tekshiriladi, chunki joylashuv shu yerda oʻzgarishi mumkin; holat keyin.
  const beforeRefresh = (): void => {
    const off = !fits() || (geometryOff && reached(root));
    if (off === geometryOff) return;
    geometryOff = off;
    place();
  };
  const afterRefresh = (): void => apply();
  ScrollTrigger.addEventListener("refreshInit", beforeRefresh);
  ScrollTrigger.addEventListener("refresh", afterRefresh);
  trigger = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    scrub: SCRUB,
    animation: tl,
    invalidateOnRefresh: true,
    onToggle: (self) => {
      for (const el of layers) {
        if (self.isActive) el.style.setProperty("will-change", "transform");
        else el.style.removeProperty("will-change");
      }
    },
    onUpdate: (self) => {
      progress.current = self.progress;
    },
  });
  const created = trigger;
  const unregister = registerAmbient(root, "scene", {
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
    ScrollTrigger.removeEventListener("refreshInit", beforeRefresh);
    ScrollTrigger.removeEventListener("refresh", afterRefresh);
    unregister();
    created.kill();
    tl.kill();
    delete root.dataset.scene;
    for (const el of layers) el.style.removeProperty("will-change");
  };
}

/* Blok ekranga kirganda nishonlar doira ritmida koʻtariladi; ekranda turgan blok yashirilmaydi. */
function riseIn(
  { gsap }: MotionEngine,
  trigger: HTMLElement,
  targets: readonly HTMLElement[],
  distance: number,
): (() => void) | null {
  if (targets.length === 0 || !belowViewport(trigger, 1)) return null;
  let tween: gsap.core.Tween | null = null;
  const watch = watchPending(trigger, targets, () => {
    tween?.scrollTrigger?.kill(false, true);
    tween?.play();
  });
  tween = gsap.from(targets, {
    autoAlpha: 0,
    y: distance,
    duration: DURATION.reveal,
    ease: EASE.out,
    stagger: doiraStaggerFn(doiraUnit(targets.length)),
    clearProps: "transform,opacity,visibility",
    scrollTrigger: { trigger, start: "top 85%", once: true, onEnter: watch.started },
  });
  return watch.dispose;
}

/**
 * Telefon va sahna sigʻmagan ekran uchun: sarlavha koʻtariladi, logotip va kadr yumshoq ochiladi,
 * qolganlari doira ritmida keladi. Ekranda turgan qism yashirilmaydi.
 */
function buildStacked(
  engine: MotionEngine,
  parts: FeatureParts,
  late: boolean,
  depth: number,
  distance: number,
): () => void {
  const { wordmark, media, text, head, items, actions } = parts;
  const disposers: Array<() => void> = [];

  // Sarlavha matndan uzoqda turadi: oʻz triggeri boʻlmasa koʻrinib turgan joyda yashirin qolardi.
  const headRise = head ? riseIn(engine, head, [head], distance) : null;
  if (headRise) disposers.push(headRise);

  const image = wordmark.querySelector<HTMLElement>("img");
  if (image && belowViewport(wordmark, 1)) {
    disposers.push(
      buildMediaReveal(engine, wordmark, { clip: wordmark, scale: image }, { mode: "smooth" }),
    );
  }

  const frame = media.querySelector<HTMLElement>(".media-frame");
  const targets = frame ? mediaTargets(frame) : null;
  if (frame && targets) {
    const parallax = !late || belowViewport(frame, 1);
    if (belowViewport(frame, 1)) {
      disposers.push(
        buildMediaReveal(engine, frame, targets, {
          mode: "smooth",
          delay: 0.09,
          restScale: parallax ? 1 + depth : 1,
        }),
      );
    }
    if (parallax) {
      const release = buildParallax(engine, frame, targets.scale, depth);
      if (release) disposers.push(release);
    }
  }

  const lines = [...items, actions].filter((el): el is HTMLElement => el !== null);
  const linesRise = riseIn(engine, text, lines, distance);
  if (linesRise) disposers.push(linesRise);

  return () => disposers.forEach((dispose) => dispose());
}

/**
 * Bosh sahifadagi UPOP TREND boʻlimi harakati: kompyuterda CSS sticky sahna (GSAP pin emas), telefonda
 * ketma-ket kirishlar. DOM yakuniy holatda, shuning uchun dvigatelsiz ham hammasi joyida koʻrinadi.
 */
export function useStickyFeature(
  scope: RefObject<HTMLElement | null>,
  /** Barg dvigatel bilan kech yuklangan boʻlsa, «kech» belgisi tashqaridan keladi. */
  lateMount = false,
): {
  readonly progress: RefObject<number>;
} {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const expanded = prefs.breakpoint === "expanded";
  const compact = prefs.breakpoint === "compact";
  const depth = useParallaxDepth();
  const progress = useRef(0);

  useEngineEffect(
    scope,
    (engine, info) => {
      const root = scope.current;
      if (!root || !allowed) return;
      const parts = queryParts(root);
      if (!parts) return;
      const late = info.late || lateMount;
      const scene = expanded ? buildScene(engine, parts, late, progress) : null;
      return scene ?? buildStacked(engine, parts, late, depth, compact ? 16 : 24);
    },
    [allowed, expanded, compact, depth, lateMount],
    { scene: true },
  );

  return { progress };
}
