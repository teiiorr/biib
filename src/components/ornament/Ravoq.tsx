import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ratioCss, ratioParts } from "@/lib/ornament/ratio";
import { safeId } from "@/lib/ornament/ids";
import { ravoqClipPath, ravoqPath, ravoqRise, type RavoqRatio } from "@/lib/ornament/ravoq";

export interface RavoqProps {
  readonly ratio?: RavoqRatio;
  readonly children?: ReactNode;
  /** 1 px oltin chiziq qirradan 6 px ichkarida (currentColor). */
  readonly hairline?: boolean;
  readonly className?: string;
}

/**
 * Toʻrt markazli ark portali: bolalarni objectBoundingBox konturi bilan qirqadi,
 * nisbat aspect-ratio bilan qulflangan, shuning uchun ark hech qachon choʻzilmaydi.
 */
export function Ravoq({ ratio = "3:4", children, hairline = true, className }: RavoqProps) {
  const id = useId();
  const clipId = safeId("ravoq", id);
  const [w, h] = ratioParts(ratio);
  const boxW = w * 100;
  const boxH = h * 100;
  /* Qirqish CSS oʻzgaruvchida: Birlashma dizaynida ark ishlatilmaydi va CSS uni oʻchiradi. */
  const style = {
    "--ravoq-ratio": ratioCss(ratio),
    "--ravoq-clip": `url(#${clipId})`,
  } as CSSProperties;
  return (
    <div className={cn("ravoq", className)} style={style} data-ratio={ratio}>
      <svg className="orn-defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={ravoqClipPath(ratio)} />
          </clipPath>
        </defs>
      </svg>
      <div className="ravoq-media">{children}</div>
      {hairline ? (
        <svg
          className="ravoq-line"
          viewBox={`0 0 ${boxW} ${boxH}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path className="orn-strand" d={ravoqPath(boxW, boxH, ravoqRise(boxW, ratio))} />
        </svg>
      ) : null}
    </div>
  );
}
