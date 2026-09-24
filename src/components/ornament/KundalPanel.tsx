import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { safeId } from "@/lib/ornament/ids";
import { islimiyPath } from "@/lib/ornament/islimiy";
import { budPath } from "@/lib/ornament/leaves";
import { KundalLight } from "./KundalLight";

export interface KundalPanelProps {
  readonly children: ReactNode;
  readonly seed?: string;
  /** Yorugʻlik kursor (kompyuter) yoki skroll (mobil) ortidan yuradi. */
  readonly light?: boolean;
  readonly className?: string;
}

const W = 1200;
const H = 400;

/**
 * Kundal: lojuvard (--art-5) zaminda boʻrtma oltin islimiy. Balandlik xaritasi — relyefning
 * xiralashtirilgan alfa kanali; feSpecularLighting nuqtali yorugʻlik bilan yaltiratadi.
 * Matn rangi .kundal-panel da tekshirilgan (--kundal-ink); relyef ingichka chiziq va yarim
 * shaffof kurtak, shuning uchun zamin lojuvardligicha qoladi va matn ustida 4.5:1 saqlanadi.
 */
export function KundalPanel({
  children,
  seed = "kundal",
  light = true,
  className,
}: KundalPanelProps) {
  const id = useId();
  const filterId = safeId("kundal", id);
  /* Uch parallel tasma: ingichka poyalar va kichik kurtaklar; katta dogʻ emas, oʻyma chiziq. */
  const RUN_W = 128;
  const runs = [4, 136, 268].map((top, i) => ({
    top,
    art: islimiyPath({
      length: W,
      seed: `${seed}-${i}`,
      side: i % 2 === 0 ? "left" : "right",
      width: RUN_W,
    }),
  }));
  const art = (
    <svg
      className="kundal-art"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={filterId}
          x="-5%"
          y="-10%"
          width="110%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="height" />
          <feSpecularLighting
            className="kundal-spec"
            in="height"
            surfaceScale="3"
            specularConstant="0.55"
            specularExponent="18"
            result="spec"
          >
            <fePointLight className="kundal-light" x={W * 0.3} y={-80} z={280} />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite
            in="SourceGraphic"
            in2="specIn"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {runs.map((run, r) => (
          <g key={r} transform={`translate(0 ${run.top + RUN_W}) rotate(-90)`}>
            {run.art.stems.map((s, i) => (
              <path key={i} className="kundal-relief-line" d={s.d} />
            ))}
            {run.art.buds.map((b, i) => (
              <path
                key={`b-${i}`}
                className="kundal-relief"
                d={budPath(b.kind)}
                transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.angle.toFixed(1)}) scale(${(b.scale * 0.9).toFixed(1)})`}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
  return (
    <div className={cn("kundal-panel", className)}>
      {light ? <KundalLight>{art}</KundalLight> : art}
      <div className="kundal-content">{children}</div>
    </div>
  );
}
