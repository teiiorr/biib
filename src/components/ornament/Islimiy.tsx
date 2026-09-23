import { cn } from "@/lib/cn";
import { islimiyPath } from "@/lib/ornament/islimiy";
import { budPath } from "@/lib/ornament/leaves";
import { IslimiyScroll } from "./IslimiyScroll";

export interface IslimiyProps {
  readonly length?: number;
  readonly width?: number;
  readonly seed?: string | number;
  readonly side?: "left" | "right";
  /** Statik oʻsish holati 0–1; skroll rejimida 1 boʻlib, jonlanishni mijoz boshqaradi. */
  readonly progress?: number;
  /** Skroll bilan oʻsadi (mijoz oʻrami). */
  readonly scroll?: boolean;
  readonly className?: string;
}

const clamp = (v: number): number => Math.min(1, Math.max(0, v));

/** Islimiy: yon hoshiyalarda (≥1280) va mobil futer/qahramon burchaklarida oʻsadigan poya. */
export function Islimiy({
  length = 720,
  width = 96,
  seed = "islimiy",
  side = "left",
  progress = 1,
  scroll = false,
  className,
}: IslimiyProps) {
  const art = islimiyPath({ length, seed, side, width });
  const p = scroll ? 1 : clamp(progress);
  const svg = (
    <svg
      className={cn("orn islimiy", className)}
      viewBox={`0 0 ${width} ${length}`}
      width={width}
      height={length}
      aria-hidden="true"
      focusable="false"
      data-side={side}
    >
      {art.stems.map((stem, i) => {
        const local = clamp((p - stem.at) / stem.span);
        return (
          <path
            key={i}
            className="orn-strand islimiy-stem"
            d={stem.d}
            data-at={stem.at.toFixed(3)}
            data-span={stem.span.toFixed(3)}
            {...(local < 1
              ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - local }
              : {})}
          />
        );
      })}
      {art.buds.map((bud, i) => {
        const local = clamp((p - bud.at) / 0.08);
        if (local === 0) return null;
        return (
          <path
            key={`bud-${i}`}
            className="islimiy-bud"
            d={budPath(bud.kind)}
            data-at={bud.at.toFixed(3)}
            transform={`translate(${bud.x.toFixed(2)} ${bud.y.toFixed(2)}) rotate(${bud.angle.toFixed(1)}) scale(${(bud.scale * local).toFixed(2)})`}
          />
        );
      })}
    </svg>
  );
  return scroll ? <IslimiyScroll>{svg}</IslimiyScroll> : svg;
}
