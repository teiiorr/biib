"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Bosilganda oçiladigan video. Özi boşlanmaydi va oldindan yuklanmaydi:
 * bu 50 soniyalik suhbat, fon harakati emas.
 *
 * <video> hamişa DOM da turadi va play() bosiş içida çaqiriladi —
 * aks holda brauzer "foydalanuvçi ruxsati yöq" deb rad etadi.
 */
export function VideoFrame({
  src,
  poster,
  label,
  posterAlt,
  className,
}: {
  src: string;
  poster: string;
  /** Tugmaning oçiq nomi, masalan "Videoni koʻrish". */
  label: string;
  posterAlt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    const video = ref.current;
    if (!video) return;
    video.controls = true;
    void video.play();
    setStarted(true);
  }

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-[1.25rem] bg-stage-bg sm:rounded-[1.5rem]",
        className,
      )}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        aria-label={posterAlt}
        className="h-full w-full bg-stage-bg object-cover"
      />

      {started ? null : (
        <button
          type="button"
          onClick={start}
          className={cn(
            "group absolute inset-0 grid place-items-center",
            "bg-[color-mix(in_srgb,var(--stage-bg)_38%,transparent)]",
            "transition-colors duration-300 ease-[var(--ease-micro)]",
            "hover:bg-[color-mix(in_srgb,var(--stage-bg)_22%,transparent)]",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
          )}
        >
          <span className="flex flex-col items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "grid h-16 w-16 place-items-center rounded-full bg-blue-cta text-ink-inverse shadow-cta",
                "transition-transform duration-300 ease-[var(--ease-pop)]",
                "group-hover:scale-110 sm:h-20 sm:w-20",
              )}
            >
              <Icon name="play" className="ml-1 h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.2} />
            </span>
            <span className="font-display text-[0.98rem] font-bold text-stage-ink">{label}</span>
          </span>
        </button>
      )}
    </div>
  );
}
