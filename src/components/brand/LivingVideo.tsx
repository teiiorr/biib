"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/brand/Icon";
import { VIDEO_KEY } from "@/lib/appearance";
import {
  announceVideo,
  getHeroVideo,
  isVideoPlaying,
  onHeroVideoChange,
  onVideoPlaying,
  registerHeroVideo,
} from "@/lib/video-signal";
import { cn } from "@/lib/cn";

/**
 * Fon boʻlib öynaydigan "jonli surat". Asos — oddiy poster rasm (SSR da
 * şu çiziladi), video kadrga kirgandagina yuklanadi va oçiladi.
 *
 * Qoidalar: harakat kamaytirilganda (tizim YOKI saytdagi tumbler —
 * html[data-motion="reduce"]) video umuman qöşilmaydi; trafik tejaş
 * rejimida (Save-Data) ham. Kadrdan çiqsa pauza (batareya va §9);
 * öynayotganda sarlavha zich rejimga ötişi uçun announceVideo çaqiriladi.
 * Foydalanuvçi pauzasi eslab qolinadi — qaytganda video özi qöşilmaydi.
 */

function motionReduced(): boolean {
  return document.documentElement.getAttribute("data-motion") === "reduce";
}

function saveData(): boolean {
  const connection = (navigator as { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

function userPaused(): boolean {
  try {
    return localStorage.getItem(VIDEO_KEY) === "paused";
  } catch {
    return false;
  }
}

export function LivingVideo({
  src,
  poster,
  posterAlt,
  control = false,
}: {
  src: string;
  poster: string;
  posterAlt: string;
  /** Faqat qahramon videosi röyxatga olinadi — VideoToggle şuni boşqaradi. */
  control?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (saveData()) return;

    let inView = false;
    let paused = userPaused();

    const wants = () => inView && !paused && !motionReduced();

    const sync = () => {
      if (wants()) {
        if (!video.src) {
          // src faqat şu yerda beriladi: sahifa oçilişida video yuklanmaydi.
          video.src = src;
          video.load();
        }
        void video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
        if (paused || motionReduced()) video.style.opacity = "0";
      }
    };

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
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "30% 0px" },
    );
    io.observe(video);

    // Saytdagi "harakatni kamaytiriş" tumbleri jonli taʼsir qilsin.
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    if (control) {
      registerHeroVideo({
        available: true,
        pause: () => {
          paused = true;
          try {
            localStorage.setItem(VIDEO_KEY, "paused");
          } catch {
            // Xotira yopiq bölsa ham pauza işlaydi, şunçaki eslab qolinmaydi.
          }
          sync();
        },
        play: () => {
          paused = false;
          try {
            localStorage.removeItem(VIDEO_KEY);
          } catch {
            // Yuqoridagidek.
          }
          sync();
        },
      });
    }

    return () => {
      io.disconnect();
      mo.disconnect();
      if (control) registerHeroVideo(null);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      if (!video.paused) announceVideo(false);
    };
  }, [src, control]);

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

/**
 * Video pauza/davom tugmasi — media qatlamidan alohida, çunki u yerdagi
 * hamma narsa aria-hidden. Video umuman yöq bölsa (harakat kamaytirilgan,
 * Save-Data) tugma ham körsatilmaydi — boşqaradigan narsasi yöq.
 */
export function VideoToggle({
  pauseLabel,
  playLabel,
  className,
}: {
  pauseLabel: string;
  playLabel: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  const available = useSyncExternalStore(
    (onChange) => onHeroVideoChange(onChange),
    () => getHeroVideo()?.available === true,
    () => false,
  );

  useEffect(() => {
    // Video obunadan oldin ketib bölgan bölişi mumkin — joriy holat olinadi.
    setPlaying(isVideoPlaying());
    return onVideoPlaying(setPlaying);
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      aria-label={playing ? pauseLabel : playLabel}
      onClick={() => {
        const api = getHeroVideo();
        if (!api) return;
        if (playing) api.pause();
        else api.play();
      }}
      className={cn(
        "tap glass glass--thin grid h-11 w-11 place-items-center rounded-pill text-label",
        "transition-[filter] duration-[var(--dur-fast)] hover:brightness-125",
        className,
      )}
    >
      <Icon name={playing ? "pause" : "play"} className="h-[1.1rem] w-[1.1rem]" />
    </button>
  );
}
