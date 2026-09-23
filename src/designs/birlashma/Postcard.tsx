import { getDictionary } from "@/i18n/dictionaries";

import { Doodle } from "./Doodles";
import type { ArtProps } from "../registry";

/** Aloqa otkritkasi bezagi: marka oʻrni va skotch; kontent tashqarida, qogʻoz koʻrinishi CSS da. */
export default function Postcard({ locale, className }: ArtProps) {
  const dict = getDictionary(locale).contacts.form;
  return (
    <span className={className ? `postcard-art ${className}` : "postcard-art"} aria-hidden="true">
      <span className="sr-only">{dict.postcardLabel}</span>
      <span className="postcard-stamp">
        <Doodle name="sun" size={32} tone="art-2" />
      </span>
      <span className="paper-fixing paper-fixing-tape" />
    </span>
  );
}
