import type { ReactNode } from "react";

import { Sticker } from "@/components/ui/Sticker";
import type { ColorStory } from "@/content/types";
import { cn } from "@/lib/cn";

import { PaperSheet } from "./PaperSheet";

interface ObjectProps {
  readonly story?: ColorStory;
  readonly children?: ReactNode;
  readonly className?: string;
}

interface PosterProps extends ObjectProps {
  /** Yosh oraligʻi («14–19 yosh»): chipta stikeri afishaning pastki burchagida. */
  readonly age?: string;
}

/** Konsert afishasi: yuqorida rang tasmasi, ichida sahna halqasi, pastki burchakda chipta stikeri. */
export function Poster({ story, age, children, className }: PosterProps) {
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
      {age ? (
        <span className="poster-ticket">
          <Sticker shape="ticket" paint={story?.secondary ?? "art-2"} rotate={2}>
            {age}
          </Sticker>
        </span>
      ) : null}
    </PaperSheet>
  );
}

/** Parda ortidagi sahna: yon ustunlar parda rangida, ichida skroll bilan ochiladigan parda. */
export function CurtainFrame({ children, className }: ObjectProps) {
  return (
    <PaperSheet
      seed="curtain-frame"
      fixing="magnet"
      className={cn("paper-object paper-curtain", className)}
    >
      <span className="curtain-frame-side" aria-hidden="true" />
      <div className="paper-object-media">{children}</div>
      <span className="curtain-frame-side curtain-frame-right" aria-hidden="true" />
    </PaperSheet>
  );
}
