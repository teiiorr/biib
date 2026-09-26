"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { fill } from "@/i18n/format";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { MediaPicker } from "./MediaPicker";
import { MediaThumb } from "./MediaThumb";
import { UploadDrop } from "./UploadDrop";

export interface PhotosFieldProps {
  readonly id: string;
  readonly value: readonly MediaItem[];
  /** Tartiblash va olib tashlash: joriy roʻyxatdan. */
  readonly onChange: (items: readonly MediaItem[]) => void;
  /** Yangi suratlar oxiriga (yuklash tugaganda holat oʻzgargan boʻlishi mumkin: qoʻshish chaqiruvchida). */
  readonly onAdd: (items: readonly MediaItem[]) => void;
  /** Muqova: suratlar orasiga qayta qoʻshilmaydi. */
  readonly coverId: string | null;
  readonly error?: string | undefined;
  readonly library: readonly MediaItem[];
  readonly onUploaded: (items: readonly MediaItem[]) => void;
  readonly onBusy: (delta: 1 | -1) => void;
}

const T = NEWS_COPY.editor;

/**
 * Tartibli suratlar: har biri oldinga, orqaga va olib tashlash tugmalari bilan (faqat sudrash emas),
 * oʻzgarish ekran oʻquvchiga eʼlon qilinadi. Bir nechtasini birdan yuklash yoki tanlash mumkin.
 */
export function PhotosField({
  id,
  value,
  onChange,
  onAdd,
  coverId,
  error,
  library,
  onUploaded,
  onBusy,
}: PhotosFieldProps) {
  const [announcement, setAnnouncement] = useState("");
  const used = new Set([...value.map((item) => item.id), ...(coverId ? [coverId] : [])]);

  function move(from: number, to: number): void {
    const next = [...value];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    onChange(next);
    setAnnouncement(fill(T.photoMoved, { to: to + 1 }));
    /* Tugma yangi oʻrinda qayta chiziladi: fokus oʻsha surat bilan birga ketadi. */
    const edge = to === 0 ? "down" : to === next.length - 1 ? "up" : from > to ? "up" : "down";
    requestAnimationFrame(() => document.getElementById(`${id}-${edge}-${item.id}`)?.focus());
  }

  function remove(index: number): void {
    onChange(value.filter((_, i) => i !== index));
    setAnnouncement(T.photoRemoved);
  }

  return (
    <div className="admin-stack">
      <p className="t-small text-ink-3">{T.photosHint}</p>
      {value.length ? (
        <ol className="admin-photos">
          {value.map((item, index) => {
            const n = index + 1;
            return (
              <li key={item.id} className="admin-photo">
                <MediaThumb
                  eager
                  item={item}
                  alt={fill(T.photoN, { n })}
                  ratio="1:1"
                  sizes="(min-width: 1024px) 160px, 45vw"
                />
                <div className="admin-photo-bar">
                  <span className="t-micro tnum text-ink-2">{fill(T.photoN, { n })}</span>
                  <span className="admin-photo-tools">
                    <Button
                      id={`${id}-up-${item.id}`}
                      variant="glass"
                      size="40"
                      iconOnly
                      aria-label={fill(T.photoUp, { n })}
                      graphic={<AdminIcon name="arrow-up" size={16} />}
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    />
                    <Button
                      id={`${id}-down-${item.id}`}
                      variant="glass"
                      size="40"
                      iconOnly
                      aria-label={fill(T.photoDown, { n })}
                      graphic={<AdminIcon name="arrow-down" size={16} />}
                      disabled={index === value.length - 1}
                      onClick={() => move(index, index + 1)}
                    />
                    <Button
                      variant="glass"
                      size="40"
                      iconOnly
                      aria-label={fill(T.photoRemove, { n })}
                      graphic={<AdminIcon name="trash" size={16} />}
                      onClick={() => remove(index)}
                    />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="t-small text-ink-2">{T.photosEmpty}</p>
      )}
      <p className="sr-only" role="status">
        {announcement}
      </p>
      <UploadDrop
        id={`${id}-upload`}
        purpose="photo"
        multiple
        label={MEDIA_COPY.uploadMany}
        onUploaded={(items) => {
          onUploaded(items);
          onAdd(items);
        }}
        onBusy={onBusy}
      />
      <div className="admin-actions">
        <MediaPicker items={library} multiple exclude={used} onPick={onAdd} />
      </div>
      <FormMessage tone="error">{error}</FormMessage>
    </div>
  );
}
