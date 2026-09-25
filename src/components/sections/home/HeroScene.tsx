import type { ReactNode } from "react";

interface HeroSceneProps {
  readonly children: ReactNode;
}

/**
 * Qahramon sahnasining oʻrami: balandligi 100svh × (1 + --hero-scene-length), ichidagi qahramon
 * yopishqoq (CSS sticky, GSAP pin emas — D-M7). Uzunlik 0 boʻlsa (kamaytirilgan harakat, Harakat = off,
 * past ekran, Birlashma) oddiy bir ekranli blok. Timeline useHeroScene da (Atlas badiiy chunki).
 */
export function HeroScene({ children }: HeroSceneProps) {
  return (
    <div className="home-hero-scene" data-hero-scene="" data-testid="hero-scene">
      {children}
    </div>
  );
}
