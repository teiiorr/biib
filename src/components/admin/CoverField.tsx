"use client";

import type { Localized } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { MediaPurpose } from "@/lib/admin/media/purposes";
import type { FieldErrors, MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { LocaleField } from "./LocaleField";
import { MediaPicker } from "./MediaPicker";
import { MediaThumb } from "./MediaThumb";
import { UploadDrop } from "./UploadDrop";

export interface CoverFieldProps {
  readonly id: string;
  readonly purpose?: MediaPurpose;
  readonly value: MediaItem | null;
  readonly onChange: (item: MediaItem | null) => void;
  readonly alt: Localized;
  readonly onAlt: (next: Localized) => void;
  readonly altPath: string;
  readonly errors: FieldErrors;
  /** Tanlash oynasidagi rasmlar (yuklangani ham shu roʻyxatga qoʻshiladi). */
  readonly library: readonly MediaItem[];
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
}

const T = NEWS_COPY.editor;

/** Muqova: 3:2 oldindan koʻrish, yuklash yoki tanlash, olib tashlash va besh tilli tavsif. */
export function CoverField({
  id,
  purpose = "cover",
  value,
  onChange,
  alt,
  onAlt,
  altPath,
  errors,
  library,
  onUploaded,
  onBusy,
}: CoverFieldProps) {
  return (
    <div className="admin-stack">
      <p className="t-small text-ink-3">{T.coverHint}</p>
      <MediaThumb
        item={value}
        alt={alt.uz || T.cover}
        ratio="3:2"
        sizes="(min-width: 1024px) 360px, 100vw"
        eager
      />
      {value ? null : <p className="t-small text-ink-2">{T.coverEmpty}</p>}
      <UploadDrop
        id={`${id}-upload`}
        purpose={purpose}
        label={MEDIA_COPY.upload}
        onUploaded={(items) => {
          onUploaded(items);
          onChange(items[0] ?? null);
        }}
        onBusy={onBusy}
      />
      <div className="admin-actions">
        <MediaPicker items={library} onPick={(items) => onChange(items[0] ?? null)} />
        {value ? (
          <Button
            variant="glass"
            size="48"
            graphic={<AdminIcon name="trash" size={20} />}
            onClick={() => onChange(null)}
          >
            {T.coverRemove}
          </Button>
        ) : null}
      </div>
      <LocaleField
        id={`${id}-alt`}
        label={T.coverAlt}
        hint={T.coverAltHint}
        value={alt}
        onChange={onAlt}
        path={altPath}
        errors={errors}
      />
    </div>
  );
}
