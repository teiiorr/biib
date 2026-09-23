import type { Design } from "@/lib/appearance/types";

interface DesignPreviewProps {
  readonly design: Design;
  readonly alt: string;
}

/** Qoʻlda chizilgan miniatyuralar: skrinshot emas, dizaynning belgisi. */
export function DesignPreview({ design, alt }: DesignPreviewProps) {
  if (design === "atlas") {
    return (
      <svg viewBox="0 0 120 72" role="img" aria-label={alt} className="design-preview">
        <rect width="120" height="72" rx="6" fill="var(--bg)" />
        <g opacity="0.95">
          <path d="M8 0h14l-3 72H5z" fill="var(--art-1)" />
          <path d="M26 0h10l-2 72h-8z" fill="var(--art-2)" />
          <path d="M40 0h16l-4 72H36z" fill="var(--art-5)" />
          <path d="M60 0h8l-1 72h-8z" fill="var(--art-3)" />
          <path d="M72 0h18l-5 72H67z" fill="var(--art-1)" />
          <path d="M94 0h10l-2 72h-9z" fill="var(--art-2)" />
          <path d="M108 0h12v72h-15z" fill="var(--art-4)" />
        </g>
        <rect
          x="14"
          y="8"
          width="92"
          height="14"
          rx="7"
          fill="var(--material-base)"
          fillOpacity="0.72"
          stroke="var(--material-rim)"
          strokeOpacity="0.8"
        />
        <path
          d="M30 34l30-14 30 14v30H30z"
          fill="none"
          stroke="var(--accent-art)"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 72" role="img" aria-label={alt} className="design-preview">
      <rect width="120" height="72" rx="6" fill="var(--bg)" />
      <rect
        x="10"
        y="12"
        width="52"
        height="48"
        rx="2"
        fill="var(--surface-2)"
        stroke="var(--line)"
        transform="rotate(-2 36 36)"
      />
      <path
        d="M20 40c6-14 20-16 30-6"
        stroke="var(--art-4)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="46" cy="28" r="6" fill="var(--art-2)" />
      <path
        d="M24 50l6-3 5 5"
        stroke="var(--art-3)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="18"
        y="8"
        width="14"
        height="6"
        fill="var(--art-6)"
        fillOpacity="0.6"
        transform="rotate(-8 25 11)"
      />
      <path
        d="M74 20l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"
        fill="none"
        stroke="var(--art-1)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="70" y="44" width="40" height="14" rx="4" fill="var(--tint)" />
      <rect x="70" y="56" width="40" height="2" fill="var(--tint-hover)" />
    </svg>
  );
}
