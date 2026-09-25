"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import { loadArt, type ArtProps, type ArtSlot } from "@/designs/registry";
import { whenIdle } from "@/lib/idle";
import { cx } from "@/lib/cx";

export interface DesignArtProps extends ArtProps {
  readonly slot: ArtSlot;
  /** Bezak emas, maʼnoli qism: aria-hidden qoʻyilmaydi. */
  readonly meaningful?: boolean;
}

/**
 * Badiiy uya sahifa yuklanib boʻsh vaqt kelganda olinadi (shrift va CSS bilan raqobatlashmaydi);
 * kelguncha oʻram boʻsh turadi.
 */
export function DesignArt({ slot, meaningful = false, className, ...art }: DesignArtProps) {
  const [Component, setComponent] = useState<ComponentType<ArtProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      void loadArt().then(async (map) => {
        const mod = await map[slot]();
        // Komponent funksiya: setState uni yangilovchi funksiya deb chaqirmasin, shu sabab oʻraladi.
        if (!cancelled) setComponent(() => mod.default);
      });
    }, 1200);
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [slot]);

  return (
    <div
      className={cx("design-art", className)}
      data-art-slot={slot}
      aria-hidden={meaningful ? undefined : true}
    >
      {Component ? <Component {...art} /> : null}
    </div>
  );
}
