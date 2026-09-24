import { getDictionary } from "@/i18n/dictionaries";

import { ColoringPage } from "./ColoringPage";
import { Doodle } from "./Doodles";
import { PaperDepth } from "./PaperDepth";
import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/**
 * Ustaxona stoli (25.8): boʻyash sahifasi va ikkita osilgan ish oʻrni, ortida uch qatlam qogʻoz-qirqma.
 * Rozilikli bolalar ishlari kelgach oʻrinlar suratlar bilan toʻladi; hozircha halol izoh.
 */
export default function ColoringHero({ locale, className }: ArtProps) {
  const dict = getDictionary(locale);
  return (
    <PaperDepth
      seed="ustaxona"
      className={className ? `coloring-hero ${className}` : "coloring-hero"}
    >
      <PaperSheet seed="coloring-sheet" fixing="tape" rotate={-0.6} className="coloring-sheet">
        <ColoringPage dict={dict.home.coloring} />
      </PaperSheet>
      <div className="pinned-stack">
        <PaperSheet seed="pinned-1" fixing="magnet" rotate={1.6} className="pinned-placeholder">
          <Doodle name="heart" size={32} tone="art-1" />
          <span className="t-small text-ink-3">{dict.home.gallery.pending}</span>
        </PaperSheet>
        <PaperSheet seed="pinned-2" fixing="pin" rotate={-1.4} className="pinned-placeholder">
          <Doodle name="star" size={32} tone="art-2" />
          <span className="t-small text-ink-3">{dict.home.gallery.pending}</span>
        </PaperSheet>
      </div>
      <span className="hero-note t-note" aria-hidden="true">
        {dict.birlashma.note.hero}
        <Doodle name="arrow" size={32} tone="art-4" className="hero-note-arrow" />
      </span>
    </PaperDepth>
  );
}
