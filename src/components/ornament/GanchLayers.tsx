import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { girihStar } from "@/lib/girih";
import { safeId } from "@/lib/ornament/ids";
import { islimiyPath } from "@/lib/ornament/islimiy";
import { budPath } from "@/lib/ornament/leaves";
import { GanchParallax } from "./GanchParallax";

export interface GanchLayersProps {
  readonly seed?: string;
  /** Skroll (0.1/0.2/0.3) va kursor (≤12 px) parallaksi. */
  readonly parallax?: boolean;
  readonly className?: string;
}

/* Har burchak oʻz SVG si: viewBox choʻzilmaydi, oʻlcham CSS da (--ganch-size). */
const C = 400;
const DEPTHS = [0.1, 0.2, 0.3] as const;
const CORNERS = [
  { key: "tl", transform: "translate(0 0)" },
  { key: "tr", transform: `translate(${C} 0) scale(-1 1)` },
  { key: "bl", transform: `translate(0 ${C}) scale(1 -1)` },
  { key: "br", transform: `translate(${C} ${C}) scale(-1 -1)` },
] as const;

/** Hoshiya: ikki chet boʻylab L shaklidagi tasma, uchlari qiyalab kesilgan. */
function band(length: number, inset: number, width: number): string {
  const outer = inset;
  const inner = inset + width;
  return [
    `M${outer} ${outer}`,
    `H${length}`,
    `L${length - width} ${inner}`,
    `H${inner}`,
    `V${length - width}`,
    `L${outer} ${length}`,
    "Z",
  ].join(" ");
}

/** Burchak bagʻri: burchak bilan arka orasidagi maydon (spandrel). */
function spandrel(size: number): string {
  return `M0 0 H${size} A${size} ${size} 0 0 0 0 ${size} Z`;
}

/** Zinali (tabaka) qirra: tasmaning ichki chetida kichik yarim doiralar qatori. */
function lobes(from: number, to: number, at: number, lobe: number): string {
  const parts: string[] = [];
  for (let x = from; x + lobe * 2 <= to; x += lobe * 2) {
    parts.push(`M${x} ${at} A${lobe} ${lobe} 0 0 1 ${x + lobe * 2} ${at}`);
    parts.push(`M${at} ${x} A${lobe} ${lobe} 0 0 0 ${at} ${x + lobe * 2}`);
  }
  return parts.join(" ");
}

/**
 * Ganch (tabaka pardoz): uch sayoz relyef qatlami faqat burchaklarda, portal ramkasi kabi.
 * Chuqurlik SVG filtrdagi ichki soya bilan (SourceAlpha xiralashtirilib, siljitilib, shakl ichiga
 * kesiladi). Tunda tokenlar lojuvard relyef va ingichka yorugʻ qirra beradi (ornament.css).
 */
export function GanchLayers({ seed = "ganch", parallax = true, className }: GanchLayersProps) {
  const id = useId();
  const filterId = safeId("ganch", id);
  /* Islimiy oʻyma tasma ichida yuqori chet boʻylab yotadi (burilgan). */
  const tracery = islimiyPath({ length: 260, seed: `${seed}-tracery`, side: "left", width: 40 });
  const star = girihStar(10, 72, { ring: false });
  const corners = (depth: number, draw: (index: number) => ReactNode) =>
    CORNERS.map((corner, i) => (
      <svg
        key={corner.key}
        className="ganch-corner"
        data-corner={corner.key}
        viewBox={`0 0 ${C} ${C}`}
        focusable="false"
      >
        {depth === 0 && i === 0 ? (
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
              <feOffset in="blur" dx="2" dy="4" result="offset" />
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
        <g transform={corner.transform} filter={depth === 0 ? `url(#${filterId})` : undefined}>
          {draw(i)}
        </g>
      </svg>
    ));
  const layers = [
    /* Chuqur qatlam: hoshiya tasmalari va burchak bagʻri, ichki soya bilan. */
    corners(0, () => (
      <>
        <path className="ganch-relief" d={band(392, 0, 36)} />
        <path className="ganch-relief" d={band(352, 48, 12)} />
        <path className="ganch-relief" d={spandrel(132)} />
      </>
    )),
    /* Oʻrta qatlam: zinali qirra va tasma ichidagi islimiy oʻyma, faqat chiziq. */
    corners(1, (i) => (
      <>
        <path className="ganch-line" d={lobes(136, 344, 62, 8)} />
        {i < 2 ? (
          <g transform="translate(120 -2) rotate(-90) scale(-1 1)">
            {tracery.stems.map((s, j) => (
              <path key={j} className="ganch-line" d={s.d} />
            ))}
            {tracery.buds.map((b, j) => (
              <path
                key={`b-${j}`}
                className="ganch-line"
                d={budPath(b.kind)}
                transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.angle.toFixed(1)}) scale(${(b.scale * 0.5).toFixed(1)})`}
              />
            ))}
          </g>
        ) : null}
      </>
    )),
    /* Yuza qatlam: burchak yulduzi, eng yaqin va eng tez qatlam. */
    corners(2, () => (
      <g transform="translate(26 26)">
        {star.strands.map((d, j) => (
          <path key={j} className="ganch-line" d={d} />
        ))}
      </g>
    )),
  ];
  const content = (
    <div className={cn("ganch", className)} aria-hidden="true">
      {layers.map((layer, i) => (
        <div key={i} className="ganch-layer" data-depth={DEPTHS[i]}>
          {layer}
        </div>
      ))}
    </div>
  );
  return parallax ? <GanchParallax>{content}</GanchParallax> : content;
}
