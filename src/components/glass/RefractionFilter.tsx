"use client";

interface RefractionFilterProps {
  readonly id: string;
  readonly href: string;
  readonly scale: number;
}

/** Har bir sirt uchun alohida filtr: xarita oʻsha sirt oʻlchamidan chizilgan. */
export function RefractionFilter({ id, href, scale }: RefractionFilterProps) {
  return (
    <svg aria-hidden="true" focusable="false" className="surface-filter" width="0" height="0">
      <filter
        id={id}
        x="0"
        y="0"
        width="1"
        height="1"
        filterUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={href} preserveAspectRatio="none" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
