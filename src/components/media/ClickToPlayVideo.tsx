"use client";

import { useRef, useState } from "react";

import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

import { useInViewPlayback } from "./useInViewPlayback";

export interface CaptionTrack {
  readonly src: string;
  /** BCP 47: uz-Latn, uz-Cyrl, ru, en. */
  readonly srcLang: string;
  readonly label: string;
}

export interface ClickToPlayVideoProps {
  readonly src: string;
  readonly poster: string;
  /** Poster oʻlchami (px): ramkasiz ishlatilganda ham oʻrin oldindan band. */
  readonly width?: number;
  readonly height?: number;
  /** Davomiyligi soniyada; tugmada m:ss koʻrinadi. */
  readonly duration?: number;
  /** Video nomi (aria-label). */
  readonly title: string;
  /** Tugma matni: «Filmni koʻrish». */
  readonly playLabel: string;
  /** Ovozli film uchun subtitr majburiy (WCAG 1.2.2). */
  readonly captions: CaptionTrack;
  readonly className?: string;
}

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${rest < 10 ? "0" : ""}${rest}`;
}

/**
 * Bosilganda yuklanadigan film: manba faqat foydalanuvchi bosganda qoʻyiladi, ovoz saqlanadi,
 * brauzer boshqaruvi koʻrsatiladi. play() bosish ichida chaqiriladi: Safari ovozli ijroni
 * faqat foydalanuvchi ishorasida boshlaydi. Yashirin varaqda va koʻrinishdan chiqqanda toʻxtaydi.
 */
export function ClickToPlayVideo({
  src,
  poster,
  width,
  height,
  duration,
  title,
  playLabel,
  captions,
  className,
}: ClickToPlayVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  useInViewPlayback(ref, { ambient: false, threshold: 0 });

  const start = (): void => {
    const video = ref.current;
    if (!video) return;
    if (!video.getAttribute("src")) video.src = src;
    setStarted(true);
    void video.play().catch(() => undefined);
  };

  return (
    <div
      className={cn("media-video media-film", className)}
      data-state={started ? "playing" : "idle"}
    >
      <video
        ref={ref}
        poster={poster}
        width={width}
        height={height}
        playsInline
        preload="none"
        controls={started}
        aria-label={title}
      >
        <track
          kind="captions"
          src={captions.src}
          srcLang={captions.srcLang}
          label={captions.label}
        />
      </video>
      {started ? null : (
        <div className="media-film-cover">
          <Surface
            as="button"
            type="button"
            radius="control"
            padding={0}
            text
            className="media-film-play t-label-l"
            onClick={start}
          >
            <Icon name="play" size={20} className="icon-play" />
            <span className="text-trim">{playLabel}</span>
            {duration ? <span className="text-trim tnum">{formatDuration(duration)}</span> : null}
          </Surface>
        </div>
      )}
    </div>
  );
}
