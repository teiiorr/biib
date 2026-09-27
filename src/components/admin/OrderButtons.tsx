"use client";

import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { cx } from "@/lib/cx";

import { AdminIcon } from "./AdminIcon";

interface OrderButtonsProps {
  readonly listId: string;
  readonly rowKey: string;
  readonly name: string;
  readonly first: boolean;
  readonly last: boolean;
  readonly onMove: (delta: -1 | 1) => void;
}

const L = PEOPLE_COPY.list;

/**
 * Yuqoriga va pastga: sudrashsiz tartiblash (klaviatura va ekran oʻquvchi bilan ham). Chetdagi tugma
 * yashirin, lekin joyi saqlanadi (ustunlar tekis); fokus qarama-qarshi tugmaga oʻtadi (focusMoved).
 */
export function OrderButtons({ listId, rowKey, name, first, last, onMove }: OrderButtonsProps) {
  return (
    <span className="admin-order-move">
      <Button
        id={`${listId}-up-${rowKey}`}
        variant="glass"
        size="40"
        iconOnly
        aria-label={fill(L.up, { name })}
        graphic={<AdminIcon name="arrow-up" size={16} />}
        disabled={first}
        className={cx(first && "admin-order-edge")}
        onClick={() => onMove(-1)}
      />
      <Button
        id={`${listId}-down-${rowKey}`}
        variant="glass"
        size="40"
        iconOnly
        aria-label={fill(L.down, { name })}
        graphic={<AdminIcon name="arrow-down" size={16} />}
        disabled={last}
        className={cx(last && "admin-order-edge")}
        onClick={() => onMove(1)}
      />
    </span>
  );
}
