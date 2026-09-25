import type { gsap } from "gsap";
import type { Flip } from "gsap/Flip";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SplitText } from "gsap/SplitText";

import { yieldToMain } from "@/lib/motion/scheduler";

export interface GsapKit {
  readonly gsap: typeof gsap;
  readonly ScrollTrigger: typeof ScrollTrigger;
  readonly SplitText: typeof SplitText;
  readonly Flip: typeof Flip;
}

/** scripts/spring-curve.mjs 0.4 0.86 32 bilan bir xil nuqtalar. */
const SPRING_POINTS =
  "0,0 0.0313,0.0728 0.0625,0.2277 0.0938,0.4015 0.125,0.5618 0.1563,0.6949 0.1875,0.7977 0.2188,0.8729 0.25,0.9251 0.2813,0.9597 0.3125,0.9813 0.3438,0.9941 0.375,1.0009 0.4063,1.004 0.4375,1.005 0.4688,1.0048 0.5,1.0041 0.5313,1.0032 0.5625,1.0024 0.5938,1.0017 0.625,1.0011 0.6563,1.0007 0.6875,1.0004 0.7188,1.0003 0.75,1.0001 0.7813,1.0001 0.8125,1 0.8438,1 0.875,1 0.9063,1 0.9375,1 0.9688,1 1,1";

/* designs/atlas.css dagi --ease-out, --ease-in-out, --ease-ui: CSS oʻtishi va tween bir xil egri chiziqda. */
const CSS_EASES = {
  out: "M0,0 C0.22,1 0.36,1 1,1",
  "in-out": "M0,0 C0.65,0 0.35,1 1,1",
  ui: "M0,0 C0.2,0 0,1 1,1",
} as const;

let kit: Promise<GsapKit> | null = null;

/**
 * GSAP va plaginlar bir marta, plaginlar shu yerda roʻyxatga olinadi. Tarmoq soʻrovlari parallel,
 * modullar esa navbat bilan baholanadi va orada asosiy oqimga navbat beriladi: dvigatel kelishi
 * 50 ms dan uzun vazifa bermaydi (§17 TBT).
 */
export function loadGsap(): Promise<GsapKit> {
  kit ??= (async () => {
    const coreModule = import("gsap");
    const triggerModule = import("gsap/ScrollTrigger");
    const easeModule = import("gsap/CustomEase");
    const splitModule = import("gsap/SplitText");
    const flipModule = import("gsap/Flip");
    const drawModule = import("gsap/DrawSVGPlugin");
    const { gsap } = await coreModule;
    await yieldToMain();
    const { ScrollTrigger } = await triggerModule;
    await yieldToMain();
    const { CustomEase } = await easeModule;
    const { SplitText } = await splitModule;
    await yieldToMain();
    const { Flip } = await flipModule;
    const { DrawSVGPlugin } = await drawModule;
    await yieldToMain();
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase);
    for (const [name, path] of Object.entries(CSS_EASES)) CustomEase.create(name, path);
    const pairs = SPRING_POINTS.split(" ").map((p) => p.split(",").map(Number));
    CustomEase.create(
      "spring-glass",
      pairs.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" "),
    );
    // iOS manzil paneli har skrollda balandlikni oʻzgartiradi: refresh boʻroni boʻlmasin.
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: "out", duration: 0.9 });
    return { gsap, ScrollTrigger, SplitText, Flip };
  })();
  return kit;
}
