"use client";

import { useEffect, useRef, useState } from "react";

import { useAmbientGovernor } from "@/components/motion/useAmbientGovernor";

import { notifyHeroReady } from "@/lib/motion/refresh";
import { cn } from "@/lib/cn";

import { AbrPoster } from "./AbrPoster";
import { startSilk, type SilkHandle } from "./abr/silk";
import type { ArtProps } from "../registry";

const REDUCED = "(prefers-reduced-motion: reduce)";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * Darvoza foni: protsedura xon-atlas (WebGL2, OGL). Matn serverda chiziladi va LCP boʻladi;
 * kanvas HTML dagi mayda asos ustida xira paydo boʻladi. Toʻliq poster faqat shader ishlamasa.
 */
export default function AbrSilk({ className }: ArtProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SilkHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [poster, setPoster] = useState<Theme | null>(null);
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
    const themeObserver = new MutationObserver(() => {
      handleRef.current?.refreshColors();
      setPoster((current) => (current ? readTheme() : current));
    });
    themeObserver.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme", "data-design"],
    });
    /* Kamaytirilgan harakat: kanvas ishga tushmaydi, statik poster koʻrsatiladi. */
    let handle: SilkHandle | null = null;
    if (!reduced) {
      try {
        handle = startSilk(canvas, () => {
          setReady(true);
          notifyHeroReady();
        });
      } catch {
        handle = null;
      }
    }
    if (!handle) {
      setPoster(readTheme());
      notifyHeroReady();
      return () => themeObserver.disconnect();
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
    const motionObserver = new MutationObserver(() => {
      handle?.setVisible(html.getAttribute("data-motion") !== "off");
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
      {poster ? <AbrPoster theme={poster} /> : null}
      <canvas ref={canvasRef} className="abr-canvas" />
    </div>
  );
}
