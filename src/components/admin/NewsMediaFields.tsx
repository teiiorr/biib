"use client";

import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { MediaItem } from "@/lib/admin/news/types";

import { CoverField } from "./CoverField";
import { FieldGroup } from "./FieldGroup";
import type { EditorSectionProps } from "./news-editor-shared";
import { PhotosField } from "./PhotosField";

interface NewsMediaFieldsProps extends EditorSectionProps {
  readonly library: readonly MediaItem[];
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
  readonly onAddPhotos: (items: readonly MediaItem[]) => void;
}

const G = NEWS_COPY.editor.groups;

export function NewsMediaFields({
  draft,
  patch,
  errors,
  idFor,
  library,
  onUploaded,
  onBusy,
  onAddPhotos,
}: NewsMediaFieldsProps) {
  return (
    <>
      <FieldGroup id={idFor("cover-group")} title={G.cover}>
        <CoverField
          id={idFor("cover")}
          value={draft.cover}
          onChange={(cover) => patch({ cover, coverStatus: cover ? "confirmed" : "pending" })}
          alt={draft.coverAlt}
          onAlt={(coverAlt) => patch({ coverAlt })}
          altPath="coverAlt"
          errors={errors}
          library={library}
          onUploaded={onUploaded}
          onBusy={onBusy}
        />
      </FieldGroup>
      <FieldGroup id={idFor("photos-group")} title={G.photos}>
        <PhotosField
          id={idFor("photos")}
          value={draft.photos}
          onChange={(photos) => patch({ photos })}
          onAdd={onAddPhotos}
          coverId={draft.cover?.id ?? null}
          error={errors.photos}
          library={library}
          onUploaded={onUploaded}
          onBusy={onBusy}
        />
      </FieldGroup>
    </>
  );
}
