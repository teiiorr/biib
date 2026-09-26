"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const THRESHOLDS = [0, 0.05, 0.25, 0.5, 0.75, 1];
/* Faqat kontent ohangi: oyna sirtlari (.surface) oʻqilmaydi. Tab-bar va yigʻilgan kapsula bir-birining
   ustida turadi; bir-birini oʻqisa, biri qorongʻi boʻlgach ikkalasi sut zaminda ham qorongʻi qolardi. */
const CONTENT_TONE = ':is([data-tone="light"], [data-tone="dark"]):not(.surface)';
/* Ohangi shu hook yozadigan elementlar (brend belgisi ham sirt emas): ular ham kontent emas. */
const readers = new Set<Element>();
/* Radix joylashuvi va morf (≈ 420 ms) tugaguncha sirt izi har kadr tekshiriladi. */
const SETTLE_FRAMES = 45;
/* Qorongʻi ulush shu chegaralar orasida boʻlsa, sirt ikki fon ustida turibdi. */
const MIXED_MIN = 0.12;

function contentTones(element: HTMLElement): Element[] {
  const list: Element[] = [];
  for (const node of document.querySelectorAll(CONTENT_TONE)) {
    if (node !== element && !element.contains(node) && !readers.has(node)) list.push(node);
  }
  return list;
}

/**
 * Sirt ostidagi kontent ohangini oʻqiydi: kuzatuv maydoni sirtning oʻz izi.
 * Eng katta kesishgan boʻlimning data-tone qiymati sirtga koʻchadi; uning ichidagi ohangli element
 * (qorongʻi surat, video) tasmaning kamida yarmini egallasa, oʻsha ichki element ustun.
 * Ostida ohangli hech narsa boʻlmasa, sirt sahifa zamini ohangiga qaytadi (atribut olib tashlanadi).
 */
export function useSurfaceTone(ref: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    readers.add(element);

    const setTone = (tone: string | null | undefined): void => {
      if (tone === "light" || tone === "dark") element.setAttribute("data-tone", tone);
      else element.removeAttribute("data-tone");
    };

    /* Oyna ichidagi element (telefondagi brend belgisi) oynaning oʻz ohangini oladi: belgi va yozuv
       doim oʻz muzi bilan bir ohangda, ostidagi suratga alohida qaramaydi. */
    const host = element.parentElement?.closest(".surface");
    if (host) {
      const sync = (): void => setTone(host.getAttribute("data-tone"));
      sync();
      const hostObserver = new MutationObserver(sync);
      hostObserver.observe(host, { attributes: true, attributeFilter: ["data-tone"] });
      return () => {
        readers.delete(element);
        hostObserver.disconnect();
        element.removeAttribute("data-tone");
      };
    }

    /* IO faqat nomzodlarni beradi (tasmaga tekkanlar). Maydon IO chegara lahzasida muzlab qoladi
       (katta surat kichik tasmada 5 % ga ham yetmaydi), shu sabab u har safar joyida oʻlchanadi. */
    const candidates = new Set<Element>();
    let observer: IntersectionObserver | null = null;
    let rebuildFrame = 0;
    let settleFrame = 0;
    let scrollFrame = 0;
    let band = "";

    const apply = (): void => {
      const own = element.getBoundingClientRect();
      const areaOf = (node: Element): number => {
        const rect = node.getBoundingClientRect();
        const width = Math.min(own.right, rect.right) - Math.max(own.left, rect.left);
        const height = Math.min(own.bottom, rect.bottom) - Math.max(own.top, rect.top);
        return width > 0 && height > 0 ? width * height : 0;
      };
      const areas = new Map<Element, number>();
      for (const node of candidates) areas.set(node, areaOf(node));
      let best: Element | null = null;
      let bestArea = 0;
      /* Ohangsiz zamin ham ovoz beradi: tasma chetiga tekkan qorongʻi tasmacha butun sirtni qoraytirmaydi. */
      let ground = own.width * own.height;
      for (const [node, area] of areas) {
        if (area > bestArea) {
          best = node;
          bestArea = area;
        }
        if (![...areas.keys()].some((other) => other !== node && other.contains(node)))
          ground -= area;
      }
      /* Surat boʻlim ichida: boʻlim maydoni doim kattaroq, shu sabab ichki element alohida tanlanadi. */
      for (const [inner, area] of areas) {
        if (best && inner !== best && best.contains(inner) && area >= bestArea / 2) {
          best = inner;
          bestArea = area;
        }
      }
      setTone(bestArea > ground ? best?.getAttribute("data-tone") : null);

      /* Sirt yorugʻ surat va tungi zamin chegarasida: qaysi ohang tanlanmasin, yorliqlarning bir qismi
         notoʻgʻri fonda qoladi. Bunday lahzada oyna qalinlashadi (materials.css), yorliq doim oʻqiladi. */
      let light = 0;
      for (const [node, area] of areas) {
        if (node.getAttribute("data-tone") === "light") light += area;
      }
      const share = light / Math.max(1, own.width * own.height);
      element.toggleAttribute("data-tone-mixed", share > MIXED_MIN && share < 1 - MIXED_MIN);
    };

    const measure = (): string => {
      /* Tasma sirtning oʻz izi: yuqori-past va chap-oʻng — oʻngdagi til guruhi chapdagi suratni oʻqimaydi. */
      const rect = element.getBoundingClientRect();
      const top = Math.max(0, Math.round(rect.top));
      const bottom = Math.max(0, Math.round(window.innerHeight - rect.bottom));
      const left = Math.max(0, Math.round(rect.left));
      const right = Math.max(0, Math.round(document.documentElement.clientWidth - rect.right));
      return `${-top}px ${-right}px ${-bottom}px ${-left}px`;
    };

    const build = (): void => {
      observer?.disconnect();
      candidates.clear();
      band = measure();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) candidates.add(entry.target);
            else candidates.delete(entry.target);
          }
          apply();
        },
        { rootMargin: band, threshold: THRESHOLDS },
      );
      const targets = contentTones(element);
      for (const target of targets) observer.observe(target);
      /* Kuzatiladigan hech narsa yoʻq: IO chaqirilmaydi, eski ohang qolib ketmasin. */
      if (targets.length === 0) apply();
    };

    const scheduleBuild = (): void => {
      if (rebuildFrame === 0) {
        rebuildFrame = requestAnimationFrame(() => {
          rebuildFrame = 0;
          build();
        });
      }
    };

    /* transform ResizeObserver ga koʻrinmaydi: tab-bar yigʻilishi, Radix joylashuvi va morf sirtning
       oʻlchamini oʻzgartirmay suradi. Iz qisqa muddat kuzatiladi, siljisa tasma qayta quriladi. */
    const settle = (): void => {
      cancelAnimationFrame(settleFrame);
      let frames = SETTLE_FRAMES;
      const step = (): void => {
        if (measure() !== band) build();
        frames -= 1;
        settleFrame = frames > 0 ? requestAnimationFrame(step) : 0;
      };
      settleFrame = requestAnimationFrame(step);
    };
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === element && event.propertyName === "transform") scheduleBuild();
    };
    const onScroll = (): void => {
      if (scrollFrame !== 0 || candidates.size === 0) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        apply();
      });
    };

    build();
    settle();
    const resize = new ResizeObserver(scheduleBuild);
    resize.observe(element);
    element.addEventListener("transitionend", onTransitionEnd);
    window.addEventListener("scroll", onScroll, { passive: true });
    /* Oʻlchami oʻzgarmagan sirt ham oyna kengligi bilan suriladi (markazdagi kapsula). */
    window.addEventListener("resize", scheduleBuild);
    /* Boʻlimlar marshrut almashganda keyin paydo boʻladi: roʻyxat oʻzgargandagina qayta yigʻiladi. */
    const sectionsSignature = (): string => {
      let next = "";
      for (const section of contentTones(element)) {
        next += `${section.tagName}:${section.getAttribute("data-tone")};`;
      }
      return next;
    };
    let signature = sectionsSignature();
    const mutations = new MutationObserver(() => {
      const next = sectionsSignature();
      if (next === signature) return;
      signature = next;
      scheduleBuild();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      readers.delete(element);
      cancelAnimationFrame(rebuildFrame);
      cancelAnimationFrame(settleFrame);
      cancelAnimationFrame(scrollFrame);
      observer?.disconnect();
      resize.disconnect();
      element.removeEventListener("transitionend", onTransitionEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleBuild);
      mutations.disconnect();
      element.removeAttribute("data-tone");
      element.removeAttribute("data-tone-mixed");
    };
  }, [ref, enabled]);
}
