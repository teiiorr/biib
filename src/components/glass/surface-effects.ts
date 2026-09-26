import { getAppearanceSnapshot, subscribeAppearance } from "@/lib/appearance/store";

import { refractionMap } from "./refraction-cache";
import { bezelWidth } from "./refraction-map";

/*
 * Oyna sirtining qirra sinishi (Chromium). Birinchi chizish uchun kerak emas, shu sabab alohida chunk:
 * Surface uni boʻsh vaqtda ulaydi. React DOM ga faqat oʻzi qoʻymagan narsalar yoziladi (--surface-refract,
 * data-refract, filtr <svg>). Yaltiroq harakatlanuvchi nuqta yoʻq (egasining talabi: oq dogʻ yoʻq).
 */

const REDUCED_TRANSPARENCY = "(prefers-reduced-transparency: reduce)";
const SVG_NS = "http://www.w3.org/2000/svg";

interface NavigatorBrands {
  readonly userAgentData?: { readonly brands: ReadonlyArray<{ readonly brand: string }> };
}

let supportCache: boolean | null = null;

/**
 * Orqa fon piksellarini JS oʻqiy olmaydi, shu sabab dvigatel boʻyicha aniqlanadi.
 * Safari backdrop-filter ichida SVG filtrni qoʻllamaydi: unga sinishsiz variant.
 */
function refractionSupported(): boolean {
  if (supportCache !== null) return supportCache;
  const brands = (navigator as NavigatorBrands).userAgentData?.brands ?? [];
  const chromium = brands.some((entry) => /chromium/i.test(entry.brand));
  const declared =
    typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "url(#lg-probe) blur(1px)");
  let applied = false;
  if (chromium && declared) {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.position = "absolute";
    probe.style.width = "1px";
    probe.style.height = "1px";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    probe.style.backdropFilter = "url(#lg-probe) blur(1px)";
    document.body.append(probe);
    applied = getComputedStyle(probe).backdropFilter.includes("url(");
    probe.remove();
  }
  supportCache = chromium && declared && applied;
  return supportCache;
}

function quantize(value: number): number {
  return Math.max(8, Math.round(value / 8) * 8);
}

let filterCount = 0;

/* Siljish qirra kengligiga nisbatan (egasining talabi: oyna yana kuchliroq): Zichlik 0 da 1.8 qirra,
   50 da 3.9, 100 da 6 (qalin muz, chetda tasvir linzadagi kabi aniq egiladi). feDisplacementMap eng
   koʻpi scale / 2 suradi. */
const REFRACT_BASE = 1.8;
const REFRACT_RANGE = 4.2;

/** Har sirt uchun alohida filtr: xarita oʻsha sirt oʻlchamidan chizilgan, kuchi Zichlikdan. */
function mountRefraction(element: HTMLElement): () => void {
  if (!refractionSupported()) return () => undefined;
  const reduced = window.matchMedia(REDUCED_TRANSPARENCY);
  filterCount += 1;
  const id = `lg-refract-${filterCount}`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("class", "surface-filter");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  const filter = document.createElementNS(SVG_NS, "filter");
  for (const [key, value] of [
    ["id", id],
    ["x", "0"],
    ["y", "0"],
    ["width", "1"],
    ["height", "1"],
    ["filterUnits", "objectBoundingBox"],
    ["color-interpolation-filters", "sRGB"],
  ] as const) {
    filter.setAttribute(key, value);
  }
  const image = document.createElementNS(SVG_NS, "feImage");
  image.setAttribute("preserveAspectRatio", "none");
  image.setAttribute("result", "map");
  const displace = document.createElementNS(SVG_NS, "feDisplacementMap");
  displace.setAttribute("in", "SourceGraphic");
  displace.setAttribute("in2", "map");
  displace.setAttribute("xChannelSelector", "R");
  displace.setAttribute("yChannelSelector", "G");
  filter.append(image, displace);
  svg.append(filter);

  let bezel = 0;
  const setScale = (): void => {
    const density = getAppearanceSnapshot().density / 100;
    const scale = Math.max(0, bezel * (REFRACT_BASE + REFRACT_RANGE * density));
    displace.setAttribute("scale", scale.toFixed(1));
  };
  const detach = (): void => {
    svg.remove();
    element.removeAttribute("data-refract");
    element.style.removeProperty("--surface-refract");
  };
  let href: string | null = null;
  const render = (): void => {
    if (!href || reduced.matches) {
      detach();
      return;
    }
    image.setAttribute("href", href);
    if (!svg.isConnected) element.prepend(svg);
    element.style.setProperty("--surface-refract", `url(#${id})`);
    element.setAttribute("data-refract", "on");
  };

  let cancelled = false;
  let lastKey = "";
  const measure = (): void => {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const width = quantize(rect.width);
    const height = quantize(rect.height);
    // Doira tugmada radius foizda (50%): pikselga oʻtkaziladi va yarim tomondan oshmaydi.
    const raw = getComputedStyle(element).borderTopLeftRadius;
    const value = Number.parseFloat(raw) || 0;
    const short = Math.min(rect.width, rect.height);
    const radius = Math.round(
      Math.min(raw.endsWith("%") ? (value / 100) * short : value, short / 2),
    );
    const key = `${width}:${height}:${radius}`;
    if (key === lastKey) return;
    lastKey = key;
    bezel = bezelWidth(width, height);
    setScale();
    void refractionMap(width, height, radius).then((next) => {
      // Oʻlcham yana oʻzgargan boʻlsa eski xarita qoʻyilmaydi.
      if (cancelled || lastKey !== key) return;
      href = next;
      render();
    });
  };

  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  reduced.addEventListener("change", render);
  const unsubscribe = subscribeAppearance(setScale);
  return () => {
    cancelled = true;
    observer.disconnect();
    reduced.removeEventListener("change", render);
    unsubscribe();
    detach();
  };
}

export interface SurfaceEffects {
  readonly refraction: boolean;
}

export function mountSurfaceEffects(
  element: HTMLElement,
  { refraction }: SurfaceEffects,
): () => void {
  const stopRefraction = refraction ? mountRefraction(element) : () => undefined;
  return () => {
    stopRefraction();
  };
}
