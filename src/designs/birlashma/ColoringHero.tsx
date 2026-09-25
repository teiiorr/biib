import { Picture } from "@/components/ui/Picture";

import { ColoringPage } from "./ColoringPage";
import { Doodle } from "./Doodles";
import { PaperDepth } from "./PaperDepth";
import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/**
 * Ustaxona stoli (25.8): boʻyash sahifasi, yoniga skotch bilan yopishtirilgan birlashma belgisi va ikkita
 * osilgan ish oʻrni, ortida uch qatlam qogʻoz-qirqma. Rozilikli bolalar ishlari kelgach oʻrinlar suratlar
 * bilan toʻladi; hozircha halol izoh.
 */
export default function ColoringHero({ copy, className }: ArtProps) {
  const coloring = copy?.coloring;
  return (
    <PaperDepth
      seed="ustaxona"
      className={className ? `coloring-hero ${className}` : "coloring-hero"}
    >
      <PaperSheet seed="coloring-sheet" fixing="tape" rotate={-0.6} className="coloring-sheet">
        {coloring ? <ColoringPage dict={coloring} /> : null}
      </PaperSheet>
      <div className="pinned-stack">
        <PaperSheet seed="mark-sticker" fixing="tape" rotate={1.4} className="hero-mark-sticker">
          <Picture src="/brand/mark.png" alt="" width={96} height={96} />
        </PaperSheet>
        <PaperSheet seed="pinned-1" fixing="magnet" rotate={1.6} className="pinned-placeholder">
          <Doodle name="heart" size={32} tone="art-1" />
          <span className="t-small text-ink-3">{copy?.galleryPending}</span>
        </PaperSheet>
        <PaperSheet seed="pinned-2" fixing="pin" rotate={-1.4} className="pinned-placeholder">
          <Doodle name="star" size={32} tone="art-2" />
          <span className="t-small text-ink-3">{copy?.galleryPending}</span>
        </PaperSheet>
      </div>
      <span className="hero-note t-note" aria-hidden="true">
        {copy?.noteHero}
        <Doodle name="arrow" size={32} tone="art-4" className="hero-note-arrow" />
      </span>
    </PaperDepth>
  );
}
