import type { ArtProps } from "../registry";

/**
 * Devoriy gazeta sarlavhasi: qoʻl yozuvi (Playpen Sans) va ikki qavat chiziq. Strelka doodle olib
 * tashlandi: u hech narsaga ishora qilmay burchakda suzib qolardi.
 */
export default function Masthead({ copy, className }: ArtProps) {
  return (
    <div className={className ? `masthead ${className}` : "masthead"} aria-hidden="true">
      <span className="masthead-text t-note">{copy?.masthead}</span>
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="masthead-rule">
        <path
          d="M2 4c50-2 100-2 196 0M2 9c60 2 120 1 196-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
