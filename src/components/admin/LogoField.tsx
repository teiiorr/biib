"use client";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { partners } from "@/i18n/dictionaries/uz/partners";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { LogoTile } from "./LogoTile";
import { MediaPicker } from "./MediaPicker";
import { UploadDrop } from "./UploadDrop";

export interface LogoFieldProps {
  readonly id: string;
  readonly value: MediaItem | null;
  readonly onChange: (item: MediaItem | null) => void;
  /** Oʻzbekcha nomi: logotip tavsifi saytda shundan. */
  readonly name: string;
  readonly library: readonly MediaItem[];
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
}

const P = PEOPLE_COPY.partners;
/* Fon shaffof qolishi kerak: JPEG va Safari ochmasligi mumkin boʻlgan AVIF qabul qilinmaydi. */
const LOGO_TYPES = ["image/png", "image/webp"] as const;

/** Logotip saytdagi qorongʻi plitkada ikki holatda koʻrinadi: odatda sut-oq, ustiga kelganda asl rangda. */
export function LogoField({
  id,
  value,
  onChange,
  name,
  library,
  onUploaded,
  onBusy,
}: LogoFieldProps) {
  const alt = fill(partners.logoAlt, { name: name || P.name });
  return (
    <div className="admin-stack">
      <p className="t-small text-ink-3">{P.logoHint}</p>
      {value ? (
        <div className="admin-logo-preview">
          <figure className="admin-logo-figure">
            <LogoTile item={value} sizes="240px" alt={alt} />
            <figcaption className="t-micro text-ink-3">{P.plain}</figcaption>
          </figure>
          <figure className="admin-logo-figure">
            <LogoTile item={value} sizes="240px" original />
            <figcaption className="t-micro text-ink-3">{P.hover}</figcaption>
          </figure>
        </div>
      ) : (
        <p className="t-small text-ink-2">{P.logoEmpty}</p>
      )}
      <UploadDrop
        id={`${id}-upload`}
        purpose="logo"
        label={MEDIA_COPY.upload}
        types={LOGO_TYPES}
        acceptHint={P.logoAccept}
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
            {PEOPLE_COPY.editor.remove}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
