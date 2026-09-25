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
  readonly copy: HTMLElement | null;
  readonly items: readonly HTMLElement[];
  readonly actions: HTMLElement | null;
  readonly dim: HTMLElement | null;
  readonly control: HTMLElement | null;
}

/* Sahna pastidagi boʻshliq (motion.css dagi padding-bottom bilan bir xil). */
const STAGE_BOTTOM = 24;

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
    copy: text.querySelector<HTMLElement>(".upop-feature-copy"),
    items: Array.from(text.querySelectorAll<HTMLElement>(".upop-feature-list > li")),
    actions: text.querySelector<HTMLElement>(".upop-feature-actions"),
    dim: media.querySelector<HTMLElement>("[data-upop-dim]"),
    control: media.querySelector<HTMLElement>(".media-video-control"),
  };
}

/* Transformdan mustaqil joylashuv: offsetParent zanjiri boʻyicha sahnaga nisbatan (D-M2 qoidasi). */
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
 * Kompyuter sahnasi: kadr butun sahnani qoplab (cover), xiralashgan holda boshlanadi, logotip
 * markazda katta; skroll bilan ikkalasi oʻz katagiga qoʻnadi, soʻng matn, dalillar va harakatlar
 * keladi. Foydalanuvchi allaqachon shu yerda boʻlsa — null (qurilmaydi). Kontent sigʻmasa sahna
 * yakuniy holatda kutadi va har refresh da qayta tekshiriladi (masalan shriftlar kelgach).
 */
function buildScene(
  { gsap, ScrollTrigger }: MotionEngine,
  parts: FeatureParts,
  late: boolean,
  progress: { current: number },
): (() => void) | null {
  const { root, stage, grid, wordmark, media, copy, items, actions, dim, control } = parts;
  if (late && reached(root)) return null;
  // Sigʻishi sahna holatini yoqmasdan oʻlchanadi: toʻr balandligi sahnaga bogʻliq emas.
  const fits = (): boolean => {
    const header = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 64;
    return grid.offsetHeight <= window.innerHeight - (header + 12) - STAGE_BOTTOM;
  };
  let geometryOff = !fits();
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
  // Logotip sahna balandligining 60 % idan oshmaydi: kadr ustida sarlavha, ekrandan chiqib ketmaydi.
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
  // 44 px boshqaruv kadr bilan birga kattalashmasin: qoʻngandan keyin paydo boʻladi.
  if (control) tl.fromTo(control, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.45);
  // Oltin chiziq ham: butun sahnaga choʻzilgan kadrda u ekran boʻylab adashgan chiziqdek koʻrinardi.
  const hairline = media.querySelector<HTMLElement>(".media-frame-line");
  if (hairline) tl.fromTo(hairline, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.45);
  if (copy) {
    tl.fromTo(
      copy,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.3, ease: EASE.out },
      0.4,
    );
  }
  if (items.length > 0) {
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
  // Oxirgi 5 %: tinch turish, keyin sahna boʻshaydi.
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
    if (geometryOff) tl.progress(1);
  };
  // Oʻlcham refresh dan oldin tekshiriladi (joylashuv shu yerda oʻzgarishi mumkin), holat keyin.
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
      stage.style.setProperty("--scene-progress", self.progress.toFixed(3));
    },
  });
  const created = trigger;
  if (geometryOff) {
    enabled = true;
    apply();
  }
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
    stage.style.removeProperty("--scene-progress");
    for (const el of layers) el.style.removeProperty("will-change");
  };
}

/**
 * Telefon va sahna sigʻmagan ekran: logotip va kadr yumshoq ochiladi (kadrda parallaks), matn,
 * dalillar va harakatlar doira ritmida koʻtariladi. Ekranda turgan qism yashirilmaydi.
 */
function buildStacked(
  engine: MotionEngine,
  parts: FeatureParts,
  late: boolean,
  depth: number,
  distance: number,
): () => void {
  const { gsap } = engine;
  const { wordmark, media, text, copy, items, actions } = parts;
  const disposers: Array<() => void> = [];

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

  const lines = [copy, ...items, actions].filter((el): el is HTMLElement => el !== null);
  if (lines.length > 0 && belowViewport(text, 1)) {
    let tween: gsap.core.Tween | null = null;
    const watch = watchPending(text, lines, () => {
      tween?.scrollTrigger?.kill(false, true);
      tween?.play();
    });
    tween = gsap.from(lines, {
      autoAlpha: 0,
      y: distance,
      duration: DURATION.reveal,
      ease: EASE.out,
      stagger: doiraStaggerFn(doiraUnit(lines.length)),
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: text, start: "top 85%", once: true, onEnter: watch.started },
    });
    disposers.push(watch.dispose);
  }

  return () => disposers.forEach((dispose) => dispose());
}

/**
 * upop-scene (motion-plan 3.8, 5.5): bosh sahifadagi UPOP TREND boʻlimining yagona muallif
 * harakati. Kompyuterda yopishqoq sahna (CSS sticky, pin emas — D-M7), telefonda ketma-ket kirishlar.
 * Boʻlim DOM i yakuniy holat: harakat oʻchiq yoki dvigatel yoʻq boʻlsa hammasi joyida koʻrinadi.
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
