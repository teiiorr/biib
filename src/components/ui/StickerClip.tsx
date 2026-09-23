export type StickerShape = "star" | "circle" | "cloud" | "ticket";

/* objectBoundingBox birliklari (0…1): shakl elementga moslab choʻziladi. */
const SHAPE_PATH: Record<StickerShape, string> = {
  star: "M0.5 0.02 L0.64 0.33 L0.98 0.37 L0.73 0.59 L0.79 0.92 L0.5 0.76 L0.21 0.92 L0.27 0.59 L0.02 0.37 L0.36 0.33 Z",
  circle: "M0.5 0 A0.5 0.5 0 1 1 0.5 1 A0.5 0.5 0 1 1 0.5 0 Z",
  cloud:
    "M0.14 0.9 C0.02 0.9 0 0.6 0.13 0.52 C0.08 0.28 0.32 0.14 0.44 0.3 C0.53 0.04 0.86 0.1 0.83 0.36 C1 0.36 1 0.78 0.86 0.9 Z",
  ticket:
    "M0 0.06 Q0 0 0.04 0 H0.96 Q1 0 1 0.06 V0.38 A0.05 0.12 0 0 0 1 0.62 V0.94 Q1 1 0.96 1 H0.04 Q0 1 0 0.94 V0.62 A0.05 0.12 0 0 0 0 0.38 Z",
};

export interface StickerClipProps {
  readonly id: string;
  readonly shape: StickerShape;
}

export function StickerClip({ id, shape }: StickerClipProps) {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <path d={SHAPE_PATH[shape]} />
      </clipPath>
    </svg>
  );
}
