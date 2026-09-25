import { getAppearanceSnapshot, subscribeAppearance } from "@/lib/appearance/store";

import { refractionMap } from "./refraction-cache";

/*
 * Oyna sirtining bezak qatlamlari: yaltiroq nuqta (sheen) va sinish (Chromium). Ikkalasi ham birinchi
 * chizish uchun kerak emas, shu sabab alohida chunk: Surface ularni boʻsh vaqtda ulaydi. React DOM ga
 * faqat oʻzi qoʻymagan narsalar yoziladi (--sheen-*, --surface-refract, data-refract, filtr <svg>).
 */

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_TRANSPARENCY = "(prefers-reduced-transparency: reduce)";
const SVG_NS = "http://www.w3.org/2000/svg";

function percentOf(value: string, size: number, fallback: number): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? (n / 100) * size : fallback;
}

/**
 * Yaltiroq nuqta: kompyuterda kursor ortidan, sensorli qurilmada skroll boʻyicha yuradi.
 * Faqat --sheen-x/--sheen-y oʻzgaradi, qatlam oʻzi qayta yotqizilmaydi.
 */
function mountSheen(element: HTMLElement): () => void {
  let frame = 0;
  let x = 0;
  let y = 0;
  const paint = (): void => {
    frame = 0;
    element.style.setProperty("--sheen-x", `${Math.round(x)}px`);
    element.style.setProperty("--sheen-y", `${Math.round(y)}px`);
  };
  const schedule = (): void => {
    if (frame === 0) frame = requestAnimationFrame(paint);
  };
  const rest = (): void => {
    const rect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);
    x = percentOf(styles.getPropertyValue("--light-x"), rect.width, rect.width * 0.3);
    y = percentOf(styles.getPropertyValue("--light-y"), rect.height, 0);
    schedule();
  };
  rest();

  if (window.matchMedia(FINE_POINTER).matches) {
    const move = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      schedule();
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", rest);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", rest);
    };
  }

  const onScroll = (): void => {
    const rect = element.getBoundingClientRect();
    const progress = (window.scrollY / Math.max(1, window.innerHeight)) % 1;
    x = rect.width * 0.3 + progress * rect.width * 0.4;
    y = progress * rect.height;
    schedule();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
  };
}

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

  const setScale = (): void => {
    const density = getAppearanceSnapshot().appearance.density / 100;
    displace.setAttribute("scale", String(8 + 56 * density));
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
    const radius = Math.round(
      Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
    );
    const key = `${width}:${height}:${radius}`;
    if (key === lastKey) return;
    lastKey = key;
    void refractionMap(width, height, radius).then((next) => {
      // Oʻlcham yana oʻzgargan boʻlsa eski xarita qoʻyilmaydi.
      if (cancelled || lastKey !== key) return;
      href = next;
      render();
    });
  };

  setScale();
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
  const stopSheen = mountSheen(element);
  const stopRefraction = refraction ? mountRefraction(element) : () => undefined;
  return () => {
    stopSheen();
    stopRefraction();
  };
}
