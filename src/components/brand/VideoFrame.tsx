"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { announceVideo } from "@/lib/video-signal";
import { cn } from "@/lib/cn";

/**
 * Bosilganda oçiladigan video. Özi boşlanmaydi va oldindan yuklanmaydi:
 * bu suhbat yozuvi, fon harakati emas.
 *
 * <video> hamişa DOM da turadi va play() bosiş içida çaqiriladi — aks
 * holda brauzer "foydalanuvçi ruxsati yöq" deb rad etadi.
 *
 * Öynay boşlaganda butun sahifaga xabar beriladi: sarlavha şu payt
 * backdrop-filter ni öçirib, zich tonlangan holatga ötadi.
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
  /** Tugmaning oçiq nomi, masalan "Videoni körиş". */
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
    <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-black", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        aria-label={posterAlt}
        onPlay={() => announceVideo(true)}
        onPause={() => announceVideo(false)}
        onEnded={() => announceVideo(false)}
        className="h-full w-full object-cover"
      />

      {started ? null : (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 grid place-items-center bg-black/25 transition-colors duration-[var(--dur-fast)] hover:bg-black/15"
        >
          {/* Media ustidagi boşqaruv — şişa öz örnida turgan yagona joy. */}
          <span className="glass glass--thin flex items-center gap-2.5 rounded-pill py-2.5 pl-3 pr-4 text-label">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-pill bg-accent text-accent-contrast"
            >
              <Icon name="play" className="ml-0.5 h-4 w-4" />
            </span>
            <span className="text-callout font-semibold">{label}</span>
          </span>
        </button>
      )}
    </div>
  );
}
