"use client";

import { useState } from "react";

import { GlassDialog } from "@/components/glass/GlassDialog";
import { GlassSheet } from "@/components/glass/GlassSheet";
import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { useIsDesktop } from "@/lib/appearance/media";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import type { GalleryMedia } from "@/lib/admin/org/types";

import { AdminIcon } from "./AdminIcon";
import { GalleryThumb } from "./GalleryThumb";

interface GalleryPickerProps {
  readonly id: string;
  readonly label: string;
  readonly items: readonly GalleryMedia[];
  readonly onPick: (media: GalleryMedia) => void;
}

const P = UPOP_COPY.gallery.picker;
const K = UPOP_COPY.gallery.kinds;

function fileName(src: string): string {
  return src.split("/").at(-1) ?? src;
}

/**
 * Galereya uchun kutubxona: tepada videolar (posteri bilan), keyin oxirgi rasmlar. Bittasi bosilsa
 * darhol tanlanadi. Kompyuterda dialog, telefonda pastki varaq.
 */
export function GalleryPicker({ id, label, items, onPick }: GalleryPickerProps) {
  const [open, setOpen] = useState(false);
  const desktop = useIsDesktop();
  const groups = [
    { key: "video", title: P.videos, list: items.filter((m) => m.kind === "video") },
    { key: "image", title: P.images, list: items.filter((m) => m.kind === "image") },
  ].filter((group) => group.list.length);

  const body = (
    <div className="admin-picker">
      {groups.length ? (
        groups.map((group) => (
          <section key={group.key} className="admin-stack" aria-labelledby={`${id}-${group.key}`}>
            <h3 id={`${id}-${group.key}`} className="t-label text-material-ink">
              {group.title}
            </h3>
            <ul className="admin-picker-grid">
              {group.list.map((media) => {
                const name = fill(P.item, { kind: K[media.kind], name: fileName(media.src) });
                return (
                  <li key={media.id}>
                    <button
                      type="button"
                      className="admin-pick"
                      aria-label={name}
                      onClick={() => {
                        onPick(media);
                        setOpen(false);
                      }}
                    >
                      <GalleryThumb media={media} alt="" ratio="1:1" sizes="160px" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      ) : (
        <p className="t-body text-material-ink">{P.empty}</p>
      )}
    </div>
  );

  const trigger = (
    <Button id={id} variant="glass" size="48" graphic={<AdminIcon name="image" size={20} />}>
      {label}
    </Button>
  );
  const shared = {
    open,
    onOpenChange: setOpen,
    trigger,
    title: P.title,
    closeLabel: ADMIN_COPY.common.close,
  };
  return desktop ? (
    <GlassDialog {...shared} description={P.description} className="admin-picker-dialog">
      {body}
    </GlassDialog>
  ) : (
    <GlassSheet {...shared}>{body}</GlassSheet>
  );
}
