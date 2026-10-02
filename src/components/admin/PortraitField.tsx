"use client";

import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { MediaPicker } from "./MediaPicker";
import { UploadDrop } from "./UploadDrop";

export interface PortraitFieldProps {
  readonly id: string;
  readonly value: MediaItem | null;
  readonly onChange: (item: MediaItem | null) => void;
  /** Saytda portret tavsifi odamning ismi, bu yerda ham shunday. */
  readonly alt: string;
  readonly library: readonly MediaItem[];
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
}

const T = PEOPLE_COPY.editor;

export function PortraitField({
  id,
  value,
  onChange,
  alt,
  library,
  onUploaded,
  onBusy,
}: PortraitFieldProps) {
  return (
    <div className="admin-stack">
      <p className="t-small text-ink-3">{T.photoHint}</p>
      <div className="admin-portrait">
        <PortraitFrame ratio="4:5">
          {value?.src ? (
            <Picture
              src={value.src}
              image={value.image ?? undefined}
              alt={alt}
              fill
              sizes="(min-width: 600px) 240px, 60vw"
              eager
            />
          ) : null}
        </PortraitFrame>
      </div>
      {value ? null : <p className="t-small text-ink-2">{T.photoEmpty}</p>}
      <UploadDrop
        id={`${id}-upload`}
        purpose="portrait"
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
            {T.remove}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
