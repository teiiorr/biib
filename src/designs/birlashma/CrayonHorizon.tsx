import { Boil } from "./Boil";
import { Doodle } from "./Doodles";
import type { ArtProps } from "../registry";

const LINE =
  "M0 16c60-6 120-8 180-4 70 4 140 3 210-2 90-6 180-4 270 1 60 3 120 4 170 2 60-3 110-4 170-1";

/** Futer ufqi: mumli pastel chizigʻi (ikki qavat, biroz siljigan) va uch-toʻrt doodle. */
export default function CrayonHorizon({ className }: ArtProps) {
  return (
    <div className={className ? `crayon-horizon ${className}` : "crayon-horizon"}>
      <svg
        viewBox="0 0 1000 32"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="crayon-line"
      >
        <path
          d={LINE}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d={LINE}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          transform="translate(0 -2)"
          opacity="0.9"
        />
      </svg>
      <div className="crayon-doodles">
        <Boil>
          <Doodle name="sun" size={48} tone="art-2" />
        </Boil>
        <Doodle name="cloud" size={48} tone="art-4" className="crayon-doodle-cloud" />
        <Doodle name="spiral" size={32} tone="art-6" className="crayon-doodle-spiral" />
        <Doodle name="star" size={32} tone="art-1" className="crayon-doodle-star" />
      </div>
    </div>
  );
}
