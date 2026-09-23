"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import { loadDesignArt, type ArtProps, type ArtSlot } from "@/designs/registry";
import { useAppearance } from "@/lib/appearance/context";
import type { Design } from "@/lib/appearance/types";
import { cn } from "@/lib/cn";

export interface DesignArtProps extends ArtProps {
  readonly slot: ArtSlot;
  /** Bezak emas, maʼnoli qism: aria-hidden qoʻyilmaydi. */
  readonly meaningful?: boolean;
  readonly fallback?: React.ReactNode;
}

interface Loaded {
  readonly design: Design;
  readonly Component: ComponentType<ArtProps> | null;
}

/** Faol dizaynning uyasi gidratsiyadan keyin yuklanadi; uyasi yoʻq dizayn hech narsa chizmaydi. */
export function DesignArt({
  slot,
  meaningful = false,
  fallback = null,
  className,
  ...art
}: DesignArtProps) {
  const { appearance } = useAppearance();
  const design = appearance.design;
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadDesignArt(design).then(async (map) => {
      const loader = map[slot];
      if (!loader) {
        if (!cancelled) setLoaded({ design, Component: null });
        return;
      }
      const mod = await loader();
      if (!cancelled) setLoaded({ design, Component: mod.default });
    });
    return () => {
      cancelled = true;
    };
  }, [design, slot]);

  const Component = loaded?.design === design ? loaded.Component : null;
  return (
    <div
      className={cn("design-art", className)}
      data-art-slot={slot}
      data-art-design={design}
      aria-hidden={meaningful ? undefined : true}
    >
      {Component ? <Component {...art} /> : fallback}
    </div>
  );
}
