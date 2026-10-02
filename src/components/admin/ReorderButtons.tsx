"use client";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { ORG_COPY } from "@/lib/admin/copy-org";

import { AdminIcon } from "./AdminIcon";

interface ReorderButtonsProps {
  /** Koʻchirilgach fokus yangi oʻrindagi tugmaga oʻtishi uchun kerak. */
  readonly idAt: (index: number) => string;
  /** Ekran oʻquvchisi uchun nom, masalan «Telegram». */
  readonly item: string;
  readonly index: number;
  readonly count: number;
  readonly onMove: (to: number) => void;
  readonly onAnnounce: (text: string) => void;
}

/** Sudrashsiz tartiblash: fokus koʻchgan qator bilan ketadi, chetga yetsa qarama-qarshi tugmaga oʻtadi. */
export function ReorderButtons({
  idAt,
  item,
  index,
  count,
  onMove,
  onAnnounce,
}: ReorderButtonsProps) {
  function move(to: number): void {
    onMove(to);
    onAnnounce(fill(ORG_COPY.moved, { item, to: to + 1 }));
    const edge = to === 0 ? "down" : to === count - 1 ? "up" : to < index ? "up" : "down";
    requestAnimationFrame(() => document.getElementById(`${idAt(to)}-${edge}`)?.focus());
  }

  return (
    <>
      <Button
        id={`${idAt(index)}-up`}
        variant="glass"
        size="48"
        iconOnly
        aria-label={fill(ORG_COPY.moveUp, { item })}
        graphic={<AdminIcon name="arrow-up" size={20} />}
        disabled={index === 0}
        onClick={() => move(index - 1)}
      />
      <Button
        id={`${idAt(index)}-down`}
        variant="glass"
        size="48"
        iconOnly
        aria-label={fill(ORG_COPY.moveDown, { item })}
        graphic={<AdminIcon name="arrow-down" size={20} />}
        disabled={index === count - 1}
        onClick={() => move(index + 1)}
      />
    </>
  );
}
