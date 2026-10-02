import type { ReactNode } from "react";

interface HeroSceneProps {
  readonly children: ReactNode;
}

/**
 * Balandligi 100svh × (1 + --hero-scene-length); ichidagi qahramon CSS sticky bilan yopishadi, GSAP pin ishlatilmaydi.
 * Uzunlik 0 boʻlsa (kamaytirilgan harakat, Harakat oʻchiq, past ekran) oddiy bir ekranli blok. Timeline useHeroScene ichida.
 */
export function HeroScene({ children }: HeroSceneProps) {
  return (
    <div className="home-hero-scene" data-hero-scene="" data-testid="hero-scene">
      {children}
    </div>
  );
}
