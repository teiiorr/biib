import type { ReactNode } from "react";
import { ArchKeystone, IslimiSpandrel } from "@/components/brand/Ornament";
import { cn } from "@/lib/cn";

/**
 * Qahramon nomini ravoq bilan tojlaydi — pastdagi har karta kiygan
 * arkni endi bosh ekran ham kiyadi, sayt yagona qurilgan darvozadek
 * öqiladi. Oltin qirra özini çizadi, cho'qqida kalit toş, yelkalarida
 * islimi. Faqat SVG çizigʻi va opacity animatsiya qilinadi.
 */
export function HeroArch({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("hero-arch relative mx-auto w-full max-w-[min(46rem,92vw)]", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 60"
        preserveAspectRatio="none"
        fill="none"
        className="hero-arch__edge"
      >
        <path
          className="hero-arch__stroke"
          d="M2 58C8 33 34 9 60 1C86 9 112 33 118 58"
          stroke="var(--line-gold-strong)"
          strokeWidth={1.25}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
        />
        <path
          d="M2 58C8 35 34 12 60 4C86 12 112 35 118 58"
          stroke="var(--gold-hi)"
          strokeWidth={0.75}
          strokeOpacity={0.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ArchKeystone className="hero-arch__orn absolute left-1/2 top-[-9px] z-10 w-6 -translate-x-1/2" />
      <IslimiSpandrel side="left" className="hero-arch__orn absolute left-1 top-[26px] z-10 w-11" />
      <IslimiSpandrel side="right" className="hero-arch__orn absolute right-1 top-[26px] z-10 w-11" />

      <div className="relative pt-[3.75rem]">{children}</div>
    </div>
  );
}
