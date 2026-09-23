import { getDictionary } from "@/i18n/dictionaries";

import { ColoringPage } from "./ColoringPage";
import { Doodle } from "./Doodles";
import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/** Ustaxona stoli: boʻyash sahifasi va ikkita osilgan ish oʻrni (rozilikli ishlar kelgach toʻladi). */
export default function ColoringHero({ locale, className }: ArtProps) {
  const dict = getDictionary(locale);
  return (
    <div className={className ? `coloring-hero ${className}` : "coloring-hero"}>
      <PaperSheet seed="coloring-sheet" fixing="tape" rotate={0.6} className="coloring-sheet">
        <ColoringPage dict={dict.home.coloring} />
      </PaperSheet>
      <PaperSheet seed="pinned-1" fixing="magnet" rotate={-1.8} className="pinned-placeholder">
        <Doodle name="heart" size={32} tone="art-1" />
        <span className="t-note text-ink-3">{dict.home.gallery.pending}</span>
      </PaperSheet>
      <span className="hero-note t-note" aria-hidden="true">
        {dict.birlashma.note.hero}
      </span>
    </div>
  );
}
