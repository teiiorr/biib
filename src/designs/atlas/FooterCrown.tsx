import { ChustBand } from "@/components/ornament/ChustBand";

import type { ArtProps } from "../registry";

/** Futer toji: Chust doʻppisining 16 ravoqli hoshiyasi, futer koʻringanda chiziladi (15.10). */
export default function FooterCrown({ className }: ArtProps) {
  return <ChustBand draw className={className ? `footer-chust ${className}` : "footer-chust"} />;
}
