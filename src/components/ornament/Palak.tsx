import { useId, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { safeId } from "@/lib/ornament/ids";
import { palakGeometry } from "@/lib/ornament/palak";
import { PalakBloom } from "./PalakBloom";

export interface PalakProps {
  readonly size?: number;
  readonly seed?: string;
  /** Boʻshliq tugmasining nomi (lugʻat: ornament.palakGapLabel). */
  readonly gapLabel: string;
  /** Bir qatorli izoh (lugʻat: ornament.palakGap). */
  readonly gapText: string;
  /** Koʻrinishga kirganda markazdan gullaydi (1400 ms). */
  readonly bloom?: boolean;
  readonly className?: string;
}

/**
 * Palak oy medalyoni. Naqsh aria-hidden, lekin ataylab qoldirilgan boʻshliq maʼno tashiydi:
 * 44 px nishonli tugma, hover/fokusda izoh (aria-describedby).
 */
export function Palak({
  size = 240,
  seed = "palak",
  gapLabel,
  gapText,
  bloom = false,
  className,
}: PalakProps) {
  const g = palakGeometry(size, seed);
  const id = useId();
  const tipId = safeId("palak-tip", id);
  const onRight = g.gap.x > size / 2;
  const tipStyle = {
    "--tip-x": `${g.gap.x.toFixed(1)}px`,
    "--tip-y": `${(g.gap.y + 28).toFixed(1)}px`,
    "--tip-shift": onRight ? "-100%" : "0%",
  } as CSSProperties;
  const svg = (
    <svg
      className="orn"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path className="palak-ring" d={g.ringPath} strokeDasharray={`0.1 ${g.pitch.toFixed(2)}`} />
      {g.loops.map((d, i) => (
        <path key={i} className="palak-loop" d={d} />
      ))}
    </svg>
  );
  return (
    <div className={cx("palak", className)} style={{ width: size, height: size }}>
      {bloom ? <PalakBloom>{svg}</PalakBloom> : svg}
      <button
        type="button"
        className="palak-gap"
        style={{ left: g.gap.x, top: g.gap.y }}
        aria-label={gapLabel}
        aria-describedby={tipId}
      />
      <span id={tipId} role="tooltip" className="palak-tip" style={tipStyle}>
        {gapText}
      </span>
    </div>
  );
}
