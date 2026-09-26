"use client";

import { useState } from "react";

import { GlassDialog } from "@/components/glass/GlassDialog";
import { GlassSheet } from "@/components/glass/GlassSheet";
import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { useIsDesktop } from "@/lib/appearance/media";
import { MEDIA_COPY } from "@/lib/admin/copy-media";
import type { MediaItem } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import { MediaThumb } from "./MediaThumb";

export interface MediaPickerProps {
  readonly items: readonly MediaItem[];
  readonly multiple?: boolean;
  /** Allaqachon ishlatilganlar: roʻyxatda koʻrinmaydi. */
  readonly exclude?: ReadonlySet<string>;
  readonly onPick: (items: readonly MediaItem[]) => void;
}

const P = MEDIA_COPY.picker;

/**
 * Oldin yuklangan rasmlardan tanlash: bittasi bosilganda darhol (muqova), koʻp tanlovda belgilab,
 * keyin «Qoʻshish». Kompyuterda dialog, telefonda pastki varaq.
 */
export function MediaPicker({ items, multiple = false, exclude, onPick }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const desktop = useIsDesktop();
  const visible = items.filter((item) => !exclude?.has(item.id));

  function toggle(item: MediaItem): void {
    if (!multiple) {
      onPick([item]);
      setOpen(false);
      return;
    }
    setSelected((ids) =>
      ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id],
    );
  }

  function confirm(): void {
    onPick(selected.flatMap((id) => visible.filter((item) => item.id === id)));
    setSelected([]);
    setOpen(false);
  }

  const body = (
    <div className="admin-picker">
      {visible.length ? (
        <ul className="admin-picker-grid">
          {visible.map((item, index) => {
            const chosen = selected.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="admin-pick"
                  aria-pressed={multiple ? chosen : undefined}
                  onClick={() => toggle(item)}
                >
                  <MediaThumb
                    item={item}
                    alt={fill(P.item, { n: index + 1 })}
                    ratio="1:1"
                    sizes="160px"
                  />
                  {chosen ? (
                    <span className="admin-pick-mark" aria-hidden="true">
                      {selected.indexOf(item.id) + 1}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="t-body text-material-ink">{P.empty}</p>
      )}
      {multiple ? (
        <div className="admin-actions">
          <Button variant="glass" size="48" onClick={() => setOpen(false)}>
            {P.cancel}
          </Button>
          <Button variant="primary" size="48" disabled={!selected.length} onClick={confirm}>
            {fill(P.add, { n: selected.length })}
          </Button>
        </div>
      ) : null}
    </div>
  );

  const trigger = (
    <Button variant="glass" size="48" graphic={<AdminIcon name="image" size={20} />}>
      {P.open}
    </Button>
  );
  const shared = {
    open,
    onOpenChange: setOpen,
    trigger,
    title: P.title,
    closeLabel: P.close,
  };
  return desktop ? (
    <GlassDialog {...shared} description={P.description} className="admin-picker-dialog">
      {body}
    </GlassDialog>
  ) : (
    <GlassSheet {...shared}>{body}</GlassSheet>
  );
}
