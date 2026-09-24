import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { ArtSlot, ColorStory } from "@/content/types";
import { coverComposition } from "@/lib/ornament/cover";
import { anorPath } from "@/lib/ornament/leaves";
import { ratioCss, type AspectRatio } from "@/lib/ornament/ratio";
import { STAR_SYMBOL_ID } from "./OrnamentSprite";

export interface OrnamentCoverProps {
  readonly story: ColorStory;
  readonly ratio: AspectRatio;
  /** Berilmasa rang hikoyasidan; bir xil urugʻ — bir xil muqova. */
  readonly seed?: string | number;
  /** Maʼnoli tasvir boʻlsa (masalan maqola muqovasi) nom; aks holda aria-hidden. */
  readonly label?: string;
  readonly className?: string;
}

/** Tailwind toʻliq sinf nomlarini koʻrishi uchun jadval: dinamik birikma yoʻq. */
const ART_FILL: Record<ArtSlot, string> = {
  "art-1": "fill-art-1",
  "art-2": "fill-art-2",
  "art-3": "fill-art-3",
  "art-4": "fill-art-4",
  "art-5": "fill-art-5",
  "art-6": "fill-art-6",
  "art-7": "fill-art-7",
};

/**
 * Tasdiqlanmagan suratlar oʻrniga loyihalangan muqova: abr tasmalari ikki hikoya rangida,
 * ustida girih yulduzi yoki anor kurtagi. Stok surat emas, boʻsh joy ham emas.
 */
export function OrnamentCover({ story, ratio, seed, label, className }: OrnamentCoverProps) {
  const composition = coverComposition(ratio, seed ?? `${story.primary}-${story.secondary}`);
  const { width, height, bands, motif } = composition;
  const style = { "--cover-ratio": ratioCss(ratio) } as CSSProperties;
  return (
    <svg
      className={cn("orn orn-cover", className)}
      viewBox={`0 0 ${width} ${height}`}
      style={style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      focusable="false"
    >
      {bands.map((band, i) => (
        <path
          key={i}
          className={ART_FILL[band.tone === "primary" ? story.primary : story.secondary]}
          d={band.d}
          opacity={band.opacity}
        />
      ))}
      {motif.kind === "star" ? (
        <use
          href={`#${STAR_SYMBOL_ID}`}
          className="text-bg"
          x={(motif.x - motif.size / 2).toFixed(1)}
          y={(motif.y - motif.size / 2).toFixed(1)}
          width={motif.size.toFixed(1)}
          height={motif.size.toFixed(1)}
        />
      ) : (
        <g
          className="text-bg"
          transform={`translate(${motif.x.toFixed(1)} ${motif.y.toFixed(1)}) rotate(${motif.angle.toFixed(1)})`}
        >
          <path
            className="orn-strand"
            d={`M${(-motif.size * 0.6).toFixed(1)} 0 Q${(-motif.size * 0.3).toFixed(1)} ${(motif.size * 0.2).toFixed(1)} 0 0`}
          />
          <path className="fill-bg" d={anorPath()} transform={`scale(${motif.size.toFixed(1)})`} />
        </g>
      )}
    </svg>
  );
}
