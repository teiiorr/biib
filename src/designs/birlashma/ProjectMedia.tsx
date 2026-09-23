import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/** Loyiha mediasi uchun qogʻoz ramka: media uyasi ichida bolalar. */
export default function ProjectMedia({ children, className, story }: ArtProps) {
  return (
    <PaperSheet
      seed={story ? `${story.primary}-${story.secondary}` : "media"}
      fixing="tape"
      className={className ? `project-media ${className}` : "project-media"}
    >
      {children}
    </PaperSheet>
  );
}
