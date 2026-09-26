"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Surface } from "@/components/glass/Surface";
import { Icon } from "@/components/icons/Icon";
import { useInViewPlayback } from "@/components/media/useInViewPlayback";
import { VideoSourceList } from "@/components/media/VideoSourceList";
import { useHeroScene } from "@/components/motion/useHeroScene";
import { HERO_LOCK_AT, HERO_LOGO_BOX, HERO_MEDIA, HERO_PORTRAIT_MEDIA } from "@/content/brand";
import { useMediaQuery } from "@/lib/appearance/media";
import { cx } from "@/lib/cx";
import { coverRect, logoRect } from "@/lib/motion/cover";
import { notifyHeroReady } from "@/lib/motion/refresh";

import type { ArtProps } from "../registry";

/**
 * Qahramon videosi: egasining animatsiyasi server posteri ustida sezilmay boshlanadi (poster = 0-kadr),
 * bir marta ijro etiladi va oxirgi kadrda — yigʻilgan belgida — turadi (halqa choki yoʻq, sakramaydi).
 * Belgi yigʻilgan lahzada (HERO_LOCK_AT) sarlavha oltin chaqnaydi; foydalanuvchi video tugamasdan
 * skroll qilsa, video tezlashib belgigacha yetadi va sahna belgini sarlavhaga olib boradi. Kamaytirilgan
 * harakat, Harakat = off va trafik tejashda — oxirgi kadr posteri (home.css). Chunk boʻsh vaqtda yuklanadi.
 */
export default function HeroVideo({ copy }: ArtProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLElement | null>(null);
  const loadedRef = useRef<string | null>(null);
  const [controlHost, setControlHost] = useState<HTMLElement | null>(null);
  const portrait = useMediaQuery(HERO_PORTRAIT_MEDIA);
  const orientation = portrait ? "portrait" : "landscape";
  const media = HERO_MEDIA[orientation];
  const { allowed, inView, paused, finished, toggle } = useInViewPlayback(videoRef, {
    once: true,
  });

  // Sahna oʻrami va boshqaruv uyasi ota (server) DOM da; layout effekt: useHeroScene shu kadrda oʻqiydi.
  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    sceneRef.current = layer.closest<HTMLElement>("[data-hero-scene]");
    const host = sceneRef.current?.querySelector<HTMLElement>("[data-hero-control]") ?? null;
    queueMicrotask(() => setControlHost(host));
  }, []);

  useHeroScene(sceneRef, { logoBox: HERO_LOGO_BOX[orientation], media });

  useEffect(() => {
    const hero = sceneRef.current?.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    /* Kadrdagi belgining oʻrni: sahna ustidagi belgi va parda shu oʻlchamlar bilan joylashadi. */
    const write = (): void => {
      const cover = coverRect(media.width, media.height, hero.clientWidth, hero.clientHeight);
      const rect = logoRect(cover, HERO_LOGO_BOX[orientation]);
      hero.style.setProperty("--logo-x", `${rect.cx.toFixed(1)}px`);
      hero.style.setProperty("--logo-y", `${rect.cy.toFixed(1)}px`);
      hero.style.setProperty("--logo-size", `${rect.size.toFixed(1)}px`);
      hero.style.setProperty("--logo-bottom-js", `${(rect.cy + rect.size / 2).toFixed(1)}px`);
    };
    write();
    const observer = new ResizeObserver(write);
    observer.observe(hero);
    return () => observer.disconnect();
  }, [media, orientation]);

  useEffect(() => {
    const video = videoRef.current;
    const layer = layerRef.current;
    if (!video || !layer || !allowed) return;
    // Yoʻnalish almashganda manba almashadi: video qayta yuklanadi, poster yana koʻrinadi.
    if (loadedRef.current !== null && loadedRef.current !== media.mp4) {
      delete layer.dataset.ready;
      video.load();
      if (inView && !paused) void video.play().catch(() => undefined);
    }
    loadedRef.current = media.mp4;
  }, [media, allowed, inView, paused]);

  // Belgi yigʻilishi: sarlavha chaqnashi (data-lock) va erta skrollda tezlashish.
  useEffect(() => {
    const video = videoRef.current;
    const hero = sceneRef.current?.querySelector<HTMLElement>("[data-hero]");
    if (!video || !hero || !allowed) return;
    const lock = (): void => {
      if (video.currentTime >= HERO_LOCK_AT || video.ended) hero.dataset.lock = "";
    };
    const restart = (): void => {
      if (video.currentTime < HERO_LOCK_AT) delete hero.dataset.lock;
      if (video.currentTime < 0.5) video.playbackRate = 1;
    };
    // Belgi hali yigʻilmagan paytda skroll boshlansa: qolgan qismi uch baravar tez, sahna belgini oladi.
    const hurry = (): void => {
      if (window.scrollY > 24 && !video.ended && video.currentTime < HERO_LOCK_AT) {
        video.playbackRate = 3;
      }
    };
    video.addEventListener("timeupdate", lock);
    video.addEventListener("ended", lock);
    video.addEventListener("play", restart);
    window.addEventListener("scroll", hurry, { passive: true });
    return () => {
      video.removeEventListener("timeupdate", lock);
      video.removeEventListener("ended", lock);
      video.removeEventListener("play", restart);
      window.removeEventListener("scroll", hurry);
    };
  }, [allowed]);

  const onPlaying = (): void => {
    const layer = layerRef.current;
    if (!layer || layer.dataset.ready === "true") return;
    layer.dataset.ready = "true";
    notifyHeroReady();
  };

  const control = allowed ? (
    <Surface
      as="button"
      type="button"
      radius="control"
      padding={0}
      text
      className="hero-loop-control"
      onClick={toggle}
      aria-label={(paused || finished ? copy?.playLabel : copy?.pauseLabel) ?? ""}
    >
      <Icon
        name={paused || finished ? "play" : "pause"}
        size={20}
        className={cx((paused || finished) && "icon-play")}
      />
    </Surface>
  ) : null;

  return (
    <div
      ref={layerRef}
      className="hero-loop"
      data-hero-media=""
      data-chunk="hero-video"
      data-state={allowed ? (finished ? "ended" : paused ? "paused" : "playing") : "still"}
    >
      <video
        ref={videoRef}
        className="hero-loop-video"
        muted
        playsInline
        disablePictureInPicture
        preload="none"
        aria-label={copy?.videoAlt}
        onPlaying={onPlaying}
      >
        {allowed ? <VideoSourceList sources={media} /> : null}
      </video>
      <span className="hero-loop-veil" data-hero-veil="" aria-hidden="true" />
      {controlHost && control ? createPortal(control, controlHost) : null}
    </div>
  );
}
