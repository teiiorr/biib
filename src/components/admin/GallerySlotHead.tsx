"use client";

import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";

import { AdminIcon } from "./AdminIcon";
import { ReorderButtons } from "./ReorderButtons";

interface GallerySlotHeadProps {
  readonly index: number;
  readonly idFor: (field: string) => string;
  readonly filled: boolean;
  readonly onMove?: (to: number) => void;
  readonly onClear?: () => void;
  readonly onAnnounce?: (text: string) => void;
}

const G = UPOP_COPY.gallery;

export function GallerySlotHead({
  index,
  idFor,
  filled,
  onMove,
  onClear,
  onAnnounce,
}: GallerySlotHeadProps) {
  const n = index + 1;
  const name = fill(G.slot, { n });
  return (
    <div className="admin-item-head">
      <h3 id={idFor(`slot${n}-title`)} className="t-label text-ink" tabIndex={-1}>
        {name}
        {index === 0 ? <span className="text-ink-2">{` · ${G.largest}`}</span> : null}
      </h3>
      {filled ? null : <Tag>{G.empty}</Tag>}
      {filled && onMove && onClear && onAnnounce ? (
        <span className="admin-row-tools">
          <ReorderButtons
            idAt={(at) => idFor(`slot${at + 1}-move`)}
            item={name}
            index={index}
            count={8}
            onMove={onMove}
            onAnnounce={onAnnounce}
          />
          <Button
            variant="glass"
            size="48"
            aria-label={fill(G.clearLabel, { n })}
            graphic={<AdminIcon name="trash" size={20} />}
            onClick={onClear}
          >
            {G.clear}
          </Button>
        </span>
      ) : null}
    </div>
  );
}
