"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { announceVideo } from "@/lib/video-signal";

/**
 * Fon boʻlib öynaydigan "jonli surat". Asos — oddiy poster rasm (SSR da
 * şu çiziladi), video kadrga kirgandagina yuklanadi va oçiladi.
 *
 * Qoidalar: prefers-reduced-motion da video umuman qöşilmaydi; kadrdan
 * çiqsa pauza (batareya va §9); öynayotganda sarlavha zich rejimga
 * ötişi uçun announceVideo çaqiriladi.
 */
export function LivingVideo({
  src,
  poster,
  posterAlt,
}: {
  src: string;
  poster: string;
  posterAlt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPlaying = () => {
      video.style.opacity = "1";
      announceVideo(true);
    };
    const onPause = () => announceVideo(false);

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          // src faqat şu yerda beriladi: sahifa oçilişida video yuklanmaydi.
          if (!video.src) {
            video.src = src;
            video.load();
          }
          void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "30% 0px" },
    );
    io.observe(video);

    return () => {
      io.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      if (!video.paused) announceVideo(false);
    };
  }, [src]);

  return (
    <div aria-hidden="true" className="parallax-media absolute inset-0">
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes="100vw"
        quality={90}
        className="object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
      />
    </div>
  );
}
