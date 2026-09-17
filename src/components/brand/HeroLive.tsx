"use client";

import { useEffect, useRef } from "react";

/**
 * Qahramon foni: belgi qimirlamaydi, atrofidagi olov va uçqunlar
 * Higgsfield videosida uzluksiz aylanadi. WebM sifatliroq, öqiy
 * olmagan brauzer (eski Safari) mp4 oladi; yönalişga qarab alohida
 * fayl. prefers-reduced-motion yoki deviceMemory <= 4 da video
 * ulanmaydi — poster qoladi. Ekrandan çiqsa pauza.
 */
export function HeroLive({
  desktopBase,
  mobileBase,
}: {
  /** Fayl yöli kengaytmasiz: .webm yoki .mp4 qöşiladi. */
  desktopBase: string;
  mobileBase: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory <= 4) return;

    const ext = video.canPlayType('video/webm; codecs="vp9"') ? ".webm" : ".mp4";
    const mq = window.matchMedia("(max-width: 767px)");
    function applySource() {
      if (!video) return;
      const src = (mq.matches ? mobileBase : desktopBase) + ext;
      if (video.dataset.src !== src) {
        video.dataset.src = src;
        video.src = src;
        video.load();
        void video.play().catch(() => {});
      }
    }
    applySource();
    mq.addEventListener("change", applySource);

    const onPlaying = () => {
      video.style.opacity = "1";
    };
    video.addEventListener("playing", onPlaying);

    const io = new IntersectionObserver(([entry]) => {
      if (!entry || !video) return;
      if (entry.isIntersecting) void video.play().catch(() => {});
      else if (!video.paused) video.pause();
    });
    io.observe(video);

    function onVisibility() {
      if (!video) return;
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else {
        void video.play().catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", applySource);
      video.removeEventListener("playing", onPlaying);
    };
  }, [desktopBase, mobileBase]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
    />
  );
}
