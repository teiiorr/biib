"use client";

import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { GallerySlots } from "@/lib/admin/org/gallery";

import { focusField } from "./editor-focus";
import { GalleryThumb } from "./GalleryThumb";

interface GalleryMapProps {
  readonly slots: GallerySlots;
  readonly idFor: (field: string) => string;
}

const G = UPOP_COPY.gallery;

/** Kataklar havola emas, tugma: aks holda saqlanmagan oʻzgarishlar haqida soʻrov chiqadi. */
export function GalleryMap({ slots, idFor }: GalleryMapProps) {
  return (
    <figure className="admin-gallery-figure">
      <ol className="admin-gallery-map" aria-labelledby={idFor("map-caption")}>
        {slots.map((slot, index) => {
          const n = index + 1;
          const label = slot
            ? fill(G.mapFilled, { n, kind: G.kinds[slot.media.kind] })
            : fill(G.mapEmpty, { n });
          return (
            <li
              key={n}
              className="admin-gallery-cell"
              data-slot={n}
              data-filled={slot ? "" : undefined}
            >
              <button
                type="button"
                className="admin-gallery-cell-button"
                aria-label={label}
                onClick={() => focusField(idFor(`slot${n}-title`))}
              >
                {slot ? (
                  <GalleryThumb
                    media={slot.media}
                    alt=""
                    sizes="200px"
                    className="admin-gallery-cell-thumb"
                  />
                ) : null}
                <span className="admin-gallery-cell-n t-micro tnum" aria-hidden="true">
                  {n}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <figcaption id={idFor("map-caption")} className="t-small text-ink-3">
        {G.map}
      </figcaption>
    </figure>
  );
}
