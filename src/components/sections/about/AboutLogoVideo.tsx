"use client";

import { useRef } from "react";

import { useInViewPlayback } from "@/components/media/useInViewPlayback";
import { VideoSourceList } from "@/components/media/VideoSourceList";

/* Qahramon videosining belgi atrofidagi kvadrat kesimi (800×800 → 720×720, 0.8 s dan). */
const SOURCES = { webm: "/media/about-logo.webm", mp4: "/media/about-logo.mp4" } as const;
const POSTER = "/media/about-logo-poster.avif";
const END = "/media/about-logo-end.avif";

interface AboutLogoVideoProps {
  /** Videoning ekran oʻquvchi tavsifi (lugʻatdan). */
  readonly label: string;
}

/**
 * «Biz haqimizda» dagi belgi animatsiyasi: koʻrinishga kirganda bir marta oʻynaydi va yigʻilgan belgida
 * toʻxtaydi (halqa emas, chok yoʻq). Kamaytirilgan harakat va Harakat = off da darhol oxirgi kadr.
 */
export function AboutLogoVideo({ label }: AboutLogoVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { allowed } = useInViewPlayback(videoRef, { once: true });
  return (
    <div className="about-logo" data-state={allowed ? "play" : "still"}>
      {/* Oxirgi kadr: harakat oʻchiq boʻlsa koʻrinadigan tayyor belgi (oldindan tayyor AVIF). */}
      <picture className="about-logo-end">
        <img src={END} alt="" width={720} height={720} decoding="async" />
      </picture>
      <video
        ref={videoRef}
        className="about-logo-video"
        muted
        playsInline
        disablePictureInPicture
        preload="none"
        poster={POSTER}
        aria-label={label}
      >
        {allowed ? <VideoSourceList sources={SOURCES} /> : null}
      </video>
    </div>
  );
}
