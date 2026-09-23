import { getDictionary } from "@/i18n/dictionaries";

import { Doodle } from "./Doodles";
import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/** Aloqa otkritkasi: qogʻoz varaq, marka oʻrni va qalam chizigʻi; ichida bolalar (children). */
export default function Postcard({ locale, children, className }: ArtProps) {
  const dict = getDictionary(locale).contacts.form;
  return (
    <PaperSheet
      seed="postcard"
      fixing="tape"
      rotate={-1}
      className={className ? `postcard ${className}` : "postcard"}
    >
      <span className="sr-only">{dict.postcardLabel}</span>
      <span className="postcard-stamp" aria-hidden="true">
        <Doodle name="sun" size={32} tone="art-2" />
      </span>
      {children}
    </PaperSheet>
  );
}
