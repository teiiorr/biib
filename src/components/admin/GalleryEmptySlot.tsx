"use client";

import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { MediaItem } from "@/lib/admin/news/types";
import { slotDefaults } from "@/lib/admin/org/gallery";
import type { GalleryMedia } from "@/lib/admin/org/types";

import { GalleryPicker } from "./GalleryPicker";
import { GallerySlotHead } from "./GallerySlotHead";
import { UploadDrop } from "./UploadDrop";

interface GalleryEmptySlotProps {
  readonly index: number;
  readonly idFor: (field: string) => string;
  readonly library: readonly GalleryMedia[];
  readonly onPick: (media: GalleryMedia) => void;
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
}

const G = UPOP_COPY.gallery;

/** Qoʻshilgan kadr shu joyning ramkasi va harakati bilan boshlanadi. */
export function GalleryEmptySlot({
  index,
  idFor,
  library,
  onPick,
  onUploaded,
  onBusy,
}: GalleryEmptySlotProps) {
  const n = index + 1;
  const { frame, motion } = slotDefaults(index);
  return (
    <>
      <GallerySlotHead index={index} idFor={idFor} filled={false} />
      <p className="t-small text-ink-3">{G.emptyHint}</p>
      <p className="t-small text-ink-2">
        {fill(G.defaults, { frame: G.frames[frame], motion: G.motions[motion] })}
      </p>
      <div className="admin-actions">
        <GalleryPicker id={idFor(`slot${n}-add`)} label={G.add} items={library} onPick={onPick} />
      </div>
      <UploadDrop
        id={idFor(`slot${n}-upload`)}
        purpose="gallery"
        label={G.upload}
        onUploaded={onUploaded}
        onBusy={onBusy}
      />
    </>
  );
}
