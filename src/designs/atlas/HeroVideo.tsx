"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useMotionPrefs } from "@/components/motion/motion-context";
import { useHeroScene } from "@/components/motion/useHeroScene";
import {
  HERO_LOCK_AT,
  HERO_LOGO_BOX,
  HERO_MEDIA,
  HERO_PORTRAIT_MEDIA,
  HERO_SCRUB_DURATION,
} from "@/content/brand";
import { useMediaQuery } from "@/lib/appearance/media";
import { HERO_FOCUS_Y, coverRect, heroMediaBox, logoRect } from "@/lib/motion/cover";
import { motionAllowed } from "@/lib/motion/prefs";
import { notifyHeroReady } from "@/lib/motion/refresh";

import type { ArtProps } from "../registry";

/* Kadr shu farqdan kichik boʻlsa qayta sakralmaydi (24 kadr/s da yarim kadr). */
const SEEK_EPSILON = 1 / 48;

interface Seeker {
  /** Video elementi effektda ulanadi (render paytida ref oʻqilmaydi). */
  readonly attach: (video: HTMLVideoElement | null) => void;
  /** Eng soʻnggi nishon (s): sakrash tugagach aynan shu qoʻllanadi. */
  readonly target: () => number;
  readonly set: (time: number) => void;
  readonly kick: () => void;
  readonly stop: () => void;
}

/* Sakrash rAF bilan: oldingi sakrash tugamaguncha yangisi berilmaydi, faqat oxirgi nishon qoʻllanadi —
   kadr silliq, navbat toʻplanmaydi. */
function createSeeker(): Seeker {
  let target = 0;
  let frame = 0;
  let video: HTMLVideoElement | null = null;
  const step = (): void => {
    frame = 0;
    const el = video;
    if (!el || el.readyState < 1) return;
    if (!el.seeking && Math.abs(el.currentTime - target) > SEEK_EPSILON) el.currentTime = target;
    if (el.seeking || Math.abs(el.currentTime - target) > SEEK_EPSILON) {
      frame = requestAnimationFrame(step);
    }
  };
  const kick = (): void => {
    if (!frame) frame = requestAnimationFrame(step);
  };
  return {
    attach: (el) => {
      video = el;
    },
    target: () => target,
    set: (time) => {
      target = time;
      kick();
    },
    kick,
    stop: () => {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/**
 * Qahramon videosi oʻynamaydi: skroll uni kadrma-kadr oldinga suradi (egasining talabi). Oltin kitob
 * (poster = birinchi kadr) → bolalar → doira → belgi; belgi yigʻilgan lahzada (HERO_LOCK_AT) sarlavha
 * oltin chaqnaydi, keyin sahna belgini sarlavhaga olib boradi (useHeroScene). Kamaytirilgan harakat va
 * Harakat = off da video yuklanmaydi, oxirgi kadr posteri turadi.
 */
export default function HeroVideo({ copy }: ArtProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [seeker] = useState(createSeeker);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const portrait = useMediaQuery(HERO_PORTRAIT_MEDIA);
  const orientation = portrait ? "portrait" : "landscape";
  const media = HERO_MEDIA[orientation];

  // Sahna oʻrami ota (server) DOM da; layout effekt: useHeroScene shu kadrda oʻqiydi.
  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    sceneRef.current = layer.closest<HTMLElement>("[data-hero-scene]");
    heroRef.current = sceneRef.current?.querySelector<HTMLElement>("[data-hero]") ?? null;
  }, []);

  /* Sahna 0–1 ulushni beradi: vaqtga aylantiriladi, belgi yigʻilishi sarlavhaga bildiriladi. */
  const onScrub = useCallback(
    (share: number): void => {
      const video = videoRef.current;
      const duration =
        video && Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : HERO_SCRUB_DURATION;
      /* Oxirgi kadrdan biroz oldin: «ended» holatiga oʻtib, keyingi sakrashda qotib qolmasin. */
      const time = Math.min(duration - 0.05, Math.max(0, share * duration));
      const hero = heroRef.current;
      if (hero) {
        if (time >= HERO_LOCK_AT) hero.dataset.lock = "";
        else delete hero.dataset.lock;
        /* Video hali kelmagan boʻlsa (sekin tarmoq, quvvat tejash) oxirgi kadr posteri ulushga qarab chiqadi. */
        hero.style.setProperty(
          "--hero-end-mix",
          Math.min(1, Math.max(0, share * 2 - 1)).toFixed(3),
        );
      }
      seeker.set(time);
    },
    [seeker],
  );

  useHeroScene(sceneRef, {
    logoBox: HERO_LOGO_BOX[orientation],
    media,
    onScrub,
  });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    /* Kadrdagi belgining oʻrni: sahna ustidagi belgi va parda shu oʻlchamlar bilan joylashadi. */
    const write = (): void => {
      const box = heroMediaBox(hero);
      const cover = coverRect(media.width, media.height, box.width, box.height, HERO_FOCUS_Y);
      const rect = logoRect(cover, HERO_LOGO_BOX[orientation]);
      hero.style.setProperty("--logo-x", `${rect.cx.toFixed(1)}px`);
      hero.style.setProperty("--logo-y", `${rect.cy.toFixed(1)}px`);
      hero.style.setProperty("--logo-size", `${rect.size.toFixed(1)}px`);
      hero.style.setProperty("--logo-bottom-js", `${(rect.cy + rect.size / 2).toFixed(1)}px`);
    };
    write();
    const observer = new ResizeObserver(write);
    observer.observe(hero.querySelector("[data-hero-art]") ?? hero);
    return () => observer.disconnect();
  }, [media, orientation]);

  /* Manba qoʻyilgach video yuklanadi. iOS toʻxtab turgan videoni oʻzi yuklamaydi: bir lahza ijro va
     toʻxtatish buferni ochadi. Video poster ustiga faqat nishon kadri chizilgach chiqadi (seeked): aks
     holda ijro paytidagi eski kadr bir lahza koʻrinib qolardi. Ijro taqiqlansa (quvvat tejash) ham
     sakrab koʻriladi; kadr kelmasa poster va oxirgi kadr posteri qoladi. */
  useEffect(() => {
    const video = videoRef.current;
    const layer = layerRef.current;
    if (!video || !layer || !allowed) return;
    seeker.attach(video);
    delete layer.dataset.ready;
    let revealed = false;
    const reveal = (): void => {
      if (revealed) return;
      revealed = true;
      layer.dataset.ready = "true";
      notifyHeroReady();
      seeker.kick();
    };
    const showTarget = (): void => {
      video.addEventListener("seeked", reveal, { once: true });
      video.currentTime = seeker.target();
    };
    const prime = (): void => {
      void video
        .play()
        .then(() => {
          video.pause();
          showTarget();
        })
        .catch(showTarget);
    };
    video.addEventListener("loadedmetadata", prime, { once: true });
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", prime);
      video.removeEventListener("seeked", reveal);
      seeker.stop();
      seeker.attach(null);
    };
  }, [allowed, media, seeker]);

  return (
    <div
      ref={layerRef}
      className="hero-loop"
      data-hero-media=""
      data-chunk="hero-video"
      data-state={allowed ? "scrub" : "still"}
    >
      <video
        ref={videoRef}
        className="hero-loop-video"
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        aria-label={copy?.videoAlt}
      >
        {allowed ? <source src={media.mp4} type="video/mp4" /> : null}
      </video>
      <span className="hero-loop-veil" data-hero-veil="" aria-hidden="true" />
    </div>
  );
}
