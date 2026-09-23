import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Plaginlar bir marta shu yerda roʻyxatga olinadi; boshqa joyda gsap.registerPlugin chaqirilmaydi. */
let registered = false;

/** scripts/spring-curve.mjs 0.4 0.86 32 bilan bir xil nuqtalar. */
const SPRING_POINTS =
  "0,0 0.0313,0.0728 0.0625,0.2277 0.0938,0.4015 0.125,0.5618 0.1563,0.6949 0.1875,0.7977 0.2188,0.8729 0.25,0.9251 0.2813,0.9597 0.3125,0.9813 0.3438,0.9941 0.375,1.0009 0.4063,1.004 0.4375,1.005 0.4688,1.0048 0.5,1.0041 0.5313,1.0032 0.5625,1.0024 0.5938,1.0017 0.625,1.0011 0.6563,1.0007 0.6875,1.0004 0.7188,1.0003 0.75,1.0001 0.7813,1.0001 0.8125,1 0.8438,1 0.875,1 0.9063,1 0.9375,1 0.9688,1 1,1";

export function setupGsap(): typeof gsap {
  if (registered || typeof window === "undefined") return gsap;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase);
  const pairs = SPRING_POINTS.split(" ").map((p) => p.split(",").map(Number));
  const path = pairs.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  CustomEase.create("spring-glass", path);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  return gsap;
}

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  ui: "power2.out",
  spring: "spring-glass",
} as const;

/** Doira usuli: uchtalik guruh va dam (90, 90, 180 ms). */
export function doiraDelay(index: number, unit = 0.09): number {
  const group = Math.floor(index / 3);
  const inGroup = index % 3;
  return group * unit * 4 + inGroup * unit;
}

/** Roʻyxat uchun kechikishlar massivi, s: [0, .09, .18, .36, .45, .54, .72, …]. */
export function doiraStagger(count: number, unit = 0.09): number[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => doiraDelay(i, unit));
}

/** gsap `stagger` uchun funksiya: har nishon oʻz indeksiga koʻra doira ritmida kiradi. */
export function doiraStaggerFn(unit = 0.09): (index: number) => number {
  return (index: number) => doiraDelay(index, unit);
}

/** Ritm oxirgi elementdan keyingi dam bilan tugaydi: umumiy kirish davomiyligini hisoblash uchun. */
export function doiraTotal(count: number, unit = 0.09): number {
  return count <= 0 ? 0 : doiraDelay(count - 1, unit);
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase };
