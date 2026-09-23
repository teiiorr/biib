import { useId } from "react";
import { cn } from "@/lib/cn";
import { girihStar } from "@/lib/girih";
import { safeId } from "@/lib/ornament/ids";
import { islimiyPath } from "@/lib/ornament/islimiy";
import { budPath } from "@/lib/ornament/leaves";
import { ravoqPath } from "@/lib/ornament/ravoq";
import { GanchParallax } from "./GanchParallax";

export interface GanchLayersProps {
  readonly seed?: string;
  /** Skroll (0.1/0.2/0.3) va kursor (≤12 px) parallaksi. */
  readonly parallax?: boolean;
  readonly className?: string;
}

const W = 1200;
const H = 800;
const DEPTHS = [0.1, 0.2, 0.3] as const;

/**
 * Ganch (tabaka pardoz): uch sayoz relyef qatlami. Chuqurlik SVG filtrdagi ichki soya bilan:
 * SourceAlpha xiralashtirilib, siljitilib, shakl ichiga kesiladi. Tunda tokenlar lojuvard relyef
 * va ingichka yorugʻ qirra beradi (ornament.css).
 */
export function GanchLayers({ seed = "ganch", parallax = true, className }: GanchLayersProps) {
  const id = useId();
  const filterId = safeId("ganch", id);
  // Ikki koʻr ravoq pastki burchaklarda; joylashuv <g transform> bilan, yoʻl oʻzgarmaydi.
  const archW = 260;
  const archH = 360;
  const arch = ravoqPath(archW, archH, archW * 0.62, 0);
  const archPlaces = [
    { x: -60, y: H - archH + 40 },
    { x: W - archW + 60, y: H - archH + 40 },
  ];
  const scroll = islimiyPath({ length: 640, seed: `${seed}-scroll`, side: "left", width: 160 });
  const star = girihStar(10, 180, { ring: true });
  const layers = [
    <g key="arches">
      {archPlaces.map((place, i) => (
        <g key={i} transform={`translate(${place.x} ${place.y})`}>
          <path className="ganch-relief" d={arch} />
        </g>
      ))}
    </g>,
    <g key="scroll" transform={`translate(${W - 200} 80)`}>
      {scroll.stems.map((s, i) => (
        <path key={i} className="ganch-relief" d={s.d} fill="none" />
      ))}
      {scroll.buds.map((b, i) => (
        <path
          key={`b-${i}`}
          className="ganch-relief"
          d={budPath(b.kind)}
          transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.angle.toFixed(1)}) scale(${b.scale.toFixed(1)})`}
        />
      ))}
    </g>,
    <g key="star" transform="translate(80 60)">
      {star.strands.map((d, i) => (
        <path key={i} className="ganch-relief" d={d} fill="none" />
      ))}
    </g>,
  ];
  const content = (
    <div className={cn("ganch", className)} aria-hidden="true">
      {layers.map((layer, i) => (
        <svg
          key={i}
          className="ganch-layer"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          data-depth={DEPTHS[i]}
          focusable="false"
        >
          {i === 0 ? (
            <defs>
              <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                <feOffset in="blur" dx="0" dy="3" result="offset" />
                <feComposite
                  in="SourceAlpha"
                  in2="offset"
                  operator="arithmetic"
                  k2="1"
                  k3="-1"
                  result="inner"
                />
                <feFlood className="ganch-flood" result="tone" />
                <feComposite in="tone" in2="inner" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="shadow" />
                </feMerge>
              </filter>
            </defs>
          ) : null}
          <g filter={`url(#${filterId})`}>{layer}</g>
        </svg>
      ))}
    </div>
  );
  return parallax ? <GanchParallax>{content}</GanchParallax> : content;
}
