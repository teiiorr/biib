"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icons/Icon";

interface InViewVideoProps {
  readonly src: string;
  readonly poster: string;
  readonly alt: string;
  readonly pauseLabel: string;
  readonly playLabel: string;
  readonly className?: string;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Video faqat koʻrinishda ijro etiladi; kamaytirilgan harakatda poster turadi (WCAG 2.2.2).
 * Kichik oyna tugmasi bilan toʻxtatiladi. preload="none": tarmoq tejaladi.
 */
export function InViewVideo({
  src,
  poster,
  alt,
  pauseLabel,
  playLabel,
  className,
}: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mql = window.matchMedia(REDUCED);
    const apply = (): void =>
      setReduced(mql.matches || document.documentElement.getAttribute("data-motion") === "off");
    mql.addEventListener("change", apply);
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    queueMicrotask(apply);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !paused && !reduced) void video.play().catch(() => undefined);
          else video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      mql.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, [paused, reduced]);

  const toggle = (): void => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setPaused(false);
      void video.play().catch(() => undefined);
    } else {
      setPaused(true);
      video.pause();
    }
  };

  return (
    <div className={className ? `inview-video ${className}` : "inview-video"}>
      <video
        ref={ref}
        src={reduced ? undefined : src}
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        aria-label={alt}
      />
      {reduced ? null : (
        <button
          type="button"
          className="material inview-video-control"
          data-text="true"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? playLabel : pauseLabel}
        >
          <Icon name={paused ? "play" : "pause"} size={20} />
        </button>
      )}
    </div>
  );
}
