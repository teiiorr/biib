import type { ReactNode } from "react";

import type { ColorStory } from "@/content/types";
import { cn } from "@/lib/cn";

import { Doodle } from "./Doodles";
import { PaperSheet } from "./PaperSheet";

interface ObjectProps {
  readonly story?: ColorStory;
  readonly children?: ReactNode;
  readonly className?: string;
}

/** Konsert afishasi va chipta: UPOP TREND. */
export function Poster({ story, children, className }: ObjectProps) {
  return (
    <PaperSheet
      seed="poster"
      fixing="tape"
      rotate={-1.2}
      className={cn("paper-object paper-poster", className)}
    >
      <span
        className="poster-band"
        style={{ background: `var(--${story?.primary ?? "art-1"})` }}
        aria-hidden="true"
      />
      <span className="poster-band poster-band-second" aria-hidden="true" />
      <div className="paper-object-media">{children}</div>
      <span
        className="poster-ticket"
        style={{ background: `var(--${story?.secondary ?? "art-2"})` }}
        aria-hidden="true"
      >
        <span className="poster-ticket-holes" />
      </span>
    </PaperSheet>
  );
}

/** Parda ortidagi sahna: Sahna bolalari. */
export function CurtainFrame({ story, children, className }: ObjectProps) {
  return (
    <PaperSheet
      seed="curtain-frame"
      fixing="magnet"
      className={cn("paper-object paper-curtain", className)}
    >
      <span
        className="curtain-frame-side"
        style={{ background: `var(--${story?.primary ?? "art-5"})` }}
        aria-hidden="true"
      />
      <div className="paper-object-media">{children}</div>
      <span
        className="curtain-frame-side curtain-frame-right"
        style={{ background: `var(--${story?.primary ?? "art-5"})` }}
        aria-hidden="true"
      />
    </PaperSheet>
  );
}

/** Kinolenta va flipbook: Ertak ustaxonasi. */
export function FilmStrip({ children, className }: ObjectProps) {
  return (
    <PaperSheet
      seed="filmstrip"
      fixing="pin"
      rotate={1.5}
      className={cn("paper-object paper-film", className)}
    >
      <span className="film-holes" aria-hidden="true" />
      <div className="paper-object-media">{children}</div>
      <span className="film-holes" aria-hidden="true" />
    </PaperSheet>
  );
}

/** Molbertdagi surat: Rangli olam. */
export function Easel({ story, children, className }: ObjectProps) {
  return (
    <div className={cn("paper-object paper-easel", className)}>
      <PaperSheet seed="easel" fixing="none" rotate={-0.8} className="easel-canvas">
        <div className="paper-object-media">{children}</div>
      </PaperSheet>
      <svg viewBox="0 0 200 60" className="easel-legs" aria-hidden="true">
        <path
          d="M30 2l-22 56M170 2l22 56M100 8v50M14 40h172"
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <Doodle name="star" size={24} tone={story?.secondary ?? "art-6"} className="easel-doodle" />
    </div>
  );
}
