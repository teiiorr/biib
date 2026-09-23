import { getDictionary } from "@/i18n/dictionaries";

import { Doodle } from "./Doodles";
import type { ArtProps } from "../registry";

/** Devoriy gazeta sarlavhasi: qoʻl yozuvi (Playpen Sans) va marker chizigʻi. */
export default function Masthead({ locale, className }: ArtProps) {
  const dict = getDictionary(locale).news;
  return (
    <div className={className ? `masthead ${className}` : "masthead"} aria-hidden="true">
      <span className="t-note masthead-text">{dict.masthead}</span>
      <Doodle name="arrow" size={32} tone="art-4" />
    </div>
  );
}
