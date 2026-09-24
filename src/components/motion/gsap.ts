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

export { gsap, ScrollTrigger, SplitText, Flip };
