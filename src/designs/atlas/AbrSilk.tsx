"use client";

import { useEffect, useRef, useState } from "react";

import { useAmbientGovernor } from "@/components/motion/useAmbientGovernor";

import { notifyHeroReady } from "@/lib/motion/refresh";
import { cn } from "@/lib/cn";

import { AbrPoster } from "./AbrPoster";
import { startSilk, type SilkHandle } from "./abr/silk";
import type { ArtProps } from "../registry";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Darvoza foni: protsedura xon-atlas (WebGL2, OGL). Matn serverda chiziladi va LCP boʻladi;
 * kanvas birinchi kadrdan keyin xira paydo boʻladi. Koʻrinmasa yoki varaq yashirin boʻlsa toʻxtaydi.
 */
export default function AbrSilk({ className }: ArtProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SilkHandle | null>(null);
  const [ready, setReady] = useState(false);
  /* Ambient reyestr: viewportda bitta ipak sikli ishlaydi (§8 XII.3); ikkinchisi toʻxtaydi. */
  useAmbientGovernor(canvasRef, "ambient", {
    pause: () => handleRef.current?.setVisible(false),
    resume: () => handleRef.current?.setVisible(true),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const html = document.documentElement;
    const reduced =
      window.matchMedia(REDUCED).matches || html.getAttribute("data-motion") === "off";
    /* Kamaytirilgan harakat: poster qoladi, kanvas ishga tushmaydi. */
    if (reduced) {
      notifyHeroReady();
      return;
    }
    let handle: SilkHandle | null = null;
    try {
      handle = startSilk(canvas, () => {
        setReady(true);
        notifyHeroReady();
      });
    } catch {
      handle = null;
    }
    if (!handle) {
      notifyHeroReady();
      return;
    }
    handleRef.current = handle;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) handle?.setVisible(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);
    const onVisibility = (): void => handle?.setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const themeObserver = new MutationObserver(() => handle?.refreshColors());
    themeObserver.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme", "data-design"],
    });
    const motionObserver = new MutationObserver(() => {
      if (html.getAttribute("data-motion") === "off") handle?.setVisible(false);
      else handle?.setVisible(true);
    });
    motionObserver.observe(html, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      motionObserver.disconnect();
      handleRef.current = null;
      handle?.destroy();
    };
  }, []);

  return (
    <div
      className={cn("abr-silk", className)}
      aria-hidden="true"
      data-ready={ready ? "true" : "false"}
    >
      <AbrPoster alt="" className="abr-poster" />
      <canvas ref={canvasRef} className="abr-canvas" />
    </div>
  );
}
