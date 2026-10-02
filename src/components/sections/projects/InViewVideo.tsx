"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import { useInViewPlayback } from "@/components/media/useInViewPlayback";
import { VideoSourceList } from "@/components/media/VideoSourceList";
import type { VideoSources } from "@/content/types";
import { useMediaQuery } from "@/lib/appearance/media";

const COMPACT_QUERY = "(max-width: 599px)";

interface InViewVideoProps {
  /** Bitta fayl; `sources` berilsa hisobga olinmaydi. */
  readonly src?: string;
  /** WebM (AV1) + MP4 (H.264) juftligi; telefon uchun alohida kichik nusxa. */
  readonly sources?: VideoSources;
  readonly mobileSources?: VideoSources;
  /** Birinchi kadr surati; boʻlmasa kadr video yuklanguncha sahifa zaminida turadi. */
  readonly poster?: string;
  /** Poster birinchi ekranda LCP boʻlsa HTML ichida turadi, aks holda ekranga yaqinlashganda qoʻyiladi. */
  readonly priority?: boolean;
  readonly alt: string;
  readonly pauseLabel: string;
  readonly playLabel: string;
  readonly className?: string;
}

/**
 * Kamaytirilgan harakatda yoki Harakat oʻchiq boʻlsa manba qoʻyilmaydi, faqat poster turadi.
 * preload="none": tarmoq ijro boshlangandagina band boʻladi. Boshqaruv sirti doim tungi
 * materialda, shunda belgi qorongʻi kadrda ham kamida 3:1 kontrastda qoladi.
 */
export function InViewVideo({
  src,
  sources,
  mobileSources,
  poster,
  priority = false,
  alt,
  pauseLabel,
  playLabel,
  className,
}: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { allowed, paused, toggle } = useInViewPlayback(ref);
  /* Brauzer <video poster> faylini sahifa ochilishi bilan soʻraydi (≈ 90 KB): pastdagi video
     posteri birinchi ekran yuklamasiga qoʻshilmasin. */
  const [posterOn, setPosterOn] = useState(priority);
  useEffect(() => {
    const video = ref.current;
    if (posterOn || !video) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPosterOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [posterOn]);
  const compact = useMediaQuery(COMPACT_QUERY);
  const set = compact && mobileSources ? mobileSources : sources;
  const state = allowed ? (paused ? "paused" : "playing") : "still";

  return (
    <div className={clsx("media-video", className)} data-state={state}>
      <video
        ref={ref}
        src={allowed && !set ? src : undefined}
        poster={posterOn && poster ? poster : undefined}
        muted
        playsInline
        loop
        disablePictureInPicture
        preload="none"
        aria-label={alt}
      >
        {allowed && set ? <VideoSourceList sources={set} /> : null}
      </video>
      {allowed ? (
        <Surface
          as="button"
          type="button"
          radius="control"
          padding={0}
          text
          data-tone="dark"
          className="media-video-control"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? playLabel : pauseLabel}
        >
          <Icon
            name={paused ? "play" : "pause"}
            size={20}
            className={clsx(paused && "icon-play")}
          />
        </Surface>
      ) : null}
    </div>
  );
}
