import { Doodle } from "./Doodles";
import type { ArtProps } from "../registry";

/** Futer ufqi: qalam chizigʻi va uch-toʻrt kichik doodle. */
export default function CrayonHorizon({ className }: ArtProps) {
  return (
    <div className={className ? `crayon-horizon ${className}` : "crayon-horizon"}>
      <svg
        viewBox="0 0 1000 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="crayon-line"
      >
        <path
          d="M0 14c80-6 160-8 240-4 90 4 180 2 270-3 120-7 240-4 360 2 40 2 90 4 130 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="crayon-doodles">
        <Doodle name="sun" size={32} tone="art-2" />
        <Doodle name="cloud" size={32} tone="art-4" />
        <Doodle name="star" size={24} tone="art-1" />
      </div>
    </div>
  );
}
