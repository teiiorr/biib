/**
 * Harakat tizimi (§14). Sahifa quruvchilar shu yerdan import qiladi.
 *
 * Provayderlar (ildiz layoutda, shu tartibda): <MotionProvider><LenisProvider>…</LenisProvider></MotionProvider>
 * Sahifa oʻtishi: layoutda <PageTransition>{children}</PageTransition>; havolalar <TransitionLink href>.
 * Umumiy elementlar: <ViewTransition name={sharedName("news-cover", slug)}> (react dan).
 *
 * Choreografiya: <Reveal stagger>, <SplitLines as="h2">, <Draw> (SVG ichida),
 * useDepth(ref, [0.1, 0.25]) ([data-depth-layer]), usePortalScene(ref, { build }),
 * useLens(ref, activeIndex) ([data-lens], [data-lens-item]), useAmbientGovernor(ref, "ambient", { pause, resume }).
 *
 * Har biri harakat taqiqida (reduced-motion yoki data-motion="off") loyihalangan statik holatni beradi.
 * Faqat transform/opacity/clip-path/filter animatsiya qilinadi.
 */
export { MotionProvider } from "./MotionProvider";
export { useMotionPrefs } from "./motion-context";
export { LenisProvider } from "./LenisProvider";
export { useLenis, scrollTo } from "./lenis-context";
export type { ScrollTarget, ScrollToOptions } from "./lenis-context";
export { Reveal } from "./Reveal";
export type { RevealProps } from "./Reveal";
export { SplitLines } from "./SplitLines";
export type { SplitLinesProps } from "./SplitLines";
export { Draw } from "./Draw";
export type { DrawProps } from "./Draw";
export { useDepth } from "./useDepth";
export type { DepthOptions } from "./useDepth";
export { usePortalScene } from "./usePortalScene";
export type { PortalScene, PortalSceneOptions } from "./usePortalScene";
export { useAmbientGovernor } from "./useAmbientGovernor";
export { useLens } from "./useLens";
export type { LensOptions } from "./useLens";
export { TransitionLink } from "./TransitionLink";
export type { TransitionLinkProps } from "./TransitionLink";
export { PageTransition, PAGE_TRANSITION_CLASS } from "./PageTransition";
export {
  setupGsap,
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  Flip,
  CustomEase,
  EASE,
  doiraDelay,
  doiraStagger,
  doiraStaggerFn,
  doiraTotal,
} from "./gsap";
export { notifyHeroReady, scheduleScrollRefresh } from "@/lib/motion/refresh";
export { willChangeDuring } from "@/lib/motion/will-change";
export {
  NAV_FORWARD,
  NAV_BACK,
  LOCALE_SWITCH,
  THEME_SWITCH,
  DESIGN_SWITCH,
  sharedName,
  supportsViewTransitions,
} from "@/lib/motion/transitions";
export type { TransitionType, NavDirection, SharedKind } from "@/lib/motion/transitions";
export { FRAME_BUDGET, FRAME_BUDGET_MS, DURATION, MEDIA, BREAKPOINT } from "@/lib/motion/constants";
export type { MotionPrefs, Breakpoint } from "@/lib/motion/prefs";
