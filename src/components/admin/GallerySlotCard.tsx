"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { FieldErrors, MediaItem } from "@/lib/admin/news/types";
import { isFilled } from "@/lib/admin/org/fields";
import { UPOP_FRAMES, UPOP_MOTIONS } from "@/lib/admin/org/gallery";
import type { GalleryMedia, GallerySlot } from "@/lib/admin/org/types";

import { AdminIcon } from "./AdminIcon";
import { GalleryPicker } from "./GalleryPicker";
import { GallerySlotHead } from "./GallerySlotHead";
import { GalleryThumb } from "./GalleryThumb";
import { LocaleField } from "./LocaleField";
import { MediaPicker } from "./MediaPicker";
import { MediaThumb } from "./MediaThumb";
import { NativeSelect } from "./NativeSelect";

interface GallerySlotCardProps {
  readonly index: number;
  readonly slot: GallerySlot;
  readonly idFor: (field: string) => string;
  readonly errors: FieldErrors;
  readonly library: readonly GalleryMedia[];
  readonly images: readonly MediaItem[];
  readonly onChange: (slot: GallerySlot) => void;
  readonly onReplace: (media: GalleryMedia) => void;
  readonly onMove: (to: number) => void;
  readonly onClear: () => void;
  readonly onAnnounce: (text: string) => void;
}

const G = UPOP_COPY.gallery;
const FRAMES = UPOP_FRAMES.map((value) => ({ value, label: G.frames[value] }));
const MOTIONS = UPOP_MOTIONS.map((value) => ({ value, label: G.motions[value] }));

export function GallerySlotCard(props: GallerySlotCardProps) {
  const { index, slot, idFor, errors, library, images, onChange } = props;
  const n = index + 1;
  const base = `slot${n}`;
  const [captionOpen, setCaptionOpen] = useState(false);
  const showCaption = captionOpen || isFilled(slot.alt) || Boolean(errors[`${base}-alt.uz`]);
  const posterError = errors[`${base}-poster`];
  return (
    <>
      <GallerySlotHead
        index={index}
        idFor={idFor}
        filled
        onMove={props.onMove}
        onClear={props.onClear}
        onAnnounce={props.onAnnounce}
      />
      <GalleryThumb
        media={slot.media}
        alt={fill(G.slot, { n })}
        ratio="3:2"
        sizes="(min-width: 1024px) 480px, 100vw"
      />
      <div className="admin-pair admin-pair-even">
        <NativeSelect
          id={idFor(`${base}-frame`)}
          label={G.frame}
          value={slot.frame}
          options={FRAMES}
          onChange={(frame) => onChange({ ...slot, frame })}
        />
        <NativeSelect
          id={idFor(`${base}-motion`)}
          label={G.motion}
          value={slot.motion}
          options={MOTIONS}
          onChange={(motion) => onChange({ ...slot, motion })}
        />
      </div>
      {slot.media.kind === "video" ? (
        <div
          id={idFor(`${base}-poster`)}
          className="admin-gallery-poster"
          role="group"
          tabIndex={-1}
          aria-labelledby={idFor(`${base}-poster-label`)}
          aria-describedby={posterError ? idFor(`${base}-poster-error`) : undefined}
        >
          <MediaThumb item={slot.poster} alt={G.poster} ratio="3:2" sizes="160px" />
          <div className="admin-stack">
            <p id={idFor(`${base}-poster-label`)} className="t-label text-ink">
              {G.poster}
            </p>
            <p className="t-small text-ink-3">{G.posterHint}</p>
            <MediaPicker
              items={images}
              onPick={(picked) => onChange({ ...slot, poster: picked[0] ?? null })}
            />
            <FormMessage id={idFor(`${base}-poster-error`)} tone="error">
              {posterError}
            </FormMessage>
          </div>
        </div>
      ) : null}
      {showCaption ? (
        <LocaleField
          id={idFor(`${base}-alt`)}
          label={G.caption}
          hint={G.captionHint}
          value={slot.alt}
          onChange={(alt) => onChange({ ...slot, alt })}
          path={`${base}-alt`}
          errors={errors}
        />
      ) : null}
      <div className="admin-actions">
        {showCaption ? null : (
          <Button
            variant="glass"
            size="48"
            graphic={<AdminIcon name="text" size={20} />}
            onClick={() => {
              setCaptionOpen(true);
              requestAnimationFrame(() =>
                document.getElementById(idFor(`${base}-alt-uz`))?.focus(),
              );
            }}
          >
            {G.caption}
          </Button>
        )}
        <GalleryPicker
          id={idFor(`${base}-replace`)}
          label={G.replace}
          items={library}
          onPick={props.onReplace}
        />
      </div>
    </>
  );
}
