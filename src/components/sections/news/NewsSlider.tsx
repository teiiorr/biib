"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import { useMotionPrefs } from "@/components/motion/motion-context";
import { motionAllowed } from "@/lib/motion/prefs";

interface NewsSliderProps {
  /** Har bola bitta slayd (server chizgan surat). */
  readonly children: ReactNode;
  readonly label: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
}

/**
 * Maqola suratlari: gorizontal skroll-snap tasmasi — telefonda barmoq bilan suriladi, kompyuterda
 * oyna tugmalari, trekpad yoki klaviatura (tasma fokusida ← →) bilan. Avtomatik aylanish yoʻq. Joriy slayd skroll
 * holatidan hisoblanadi, shuning uchun qoʻl bilan surish ham hisoblagichni yangilaydi.
 */
export function NewsSlider({ children, label, previousLabel, nextLabel }: NewsSliderProps) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const prefs = useMotionPrefs();
  const smooth = prefs.ready && motionAllowed(prefs);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const read = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = track.clientWidth || 1;
        setIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / width))));
      });
    };
    track.addEventListener("scroll", read, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", read);
    };
  }, [count]);

  const go = useCallback(
    (next: number): void => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.min(count - 1, Math.max(0, next));
      track.scrollTo({ left: target * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    },
    [count, smooth],
  );

  return (
    <div className="news-slider" role="region" aria-roledescription="carousel" aria-label={label}>
      {/* Lenis sahifa skrollini boshqaradi: tasmaning gorizontal surilishi unga berilmaydi. Tasma fokus
          oladi — klaviaturada ← → brauzerning oʻzi slayddan slaydga suradi (skroll-snap). */}
      <ul
        ref={trackRef}
        className="news-slider-track"
        data-lenis-prevent=""
        tabIndex={count > 1 ? 0 : -1}
      >
        {slides.map((slide, i) => (
          <li
            key={i}
            className="news-slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={i === index ? undefined : true}
          >
            {slide}
          </li>
        ))}
      </ul>
      <Surface radius="control" padding={4} text className="news-slider-controls" data-tone="dark">
        <button
          type="button"
          className="news-slider-button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={previousLabel}
        >
          <Icon name="arrow-left" size={20} />
        </button>
        <span className="news-slider-count t-label tnum" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          className="news-slider-button"
          onClick={() => go(index + 1)}
          disabled={index === count - 1}
          aria-label={nextLabel}
        >
          <Icon name="arrow-right" size={20} />
        </button>
      </Surface>
    </div>
  );
}
