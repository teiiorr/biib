"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { ReorderResult } from "@/lib/admin/record";

interface OrderedRow {
  readonly id: string;
  readonly key: string;
}

/**
 * Roʻyxat javob kutmasdan yangi tartibda chiziladi. Ketma-ket bosishda faqat oxirgi javob olinadi,
 * xato boʻlsa server tartibi tiklanadi.
 */
export function useReorder<R extends OrderedRow>(
  rows: readonly R[],
  commit: (keys: readonly string[]) => Promise<ReorderResult<R>>,
) {
  const router = useRouter();
  const [source, setSource] = useState(rows);
  const [items, setItems] = useState(rows);
  const [announcement, setAnnouncement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ticket = useRef(0);

  /* Server yangi roʻyxat yubordi (saqlash, oʻchirish yoki yangilash): mahalliy tartib unga tenglashadi. */
  if (rows !== source) {
    setSource(rows);
    setItems(rows);
  }

  function move(from: number, to: number, message: string): void {
    const next = [...items];
    const [row] = next.splice(from, 1);
    if (!row || to < 0 || to > next.length) return;
    next.splice(to, 0, row);
    setItems(next);
    setError(null);
    setAnnouncement(message);
    const current = ++ticket.current;
    startTransition(async () => {
      const result = await commit(next.map((item) => item.key));
      if (current !== ticket.current) return;
      if (result.ok) {
        setItems(result.rows);
        setAnnouncement(PEOPLE_COPY.list.saved);
        return;
      }
      setItems(source);
      setError(result.message);
      setAnnouncement(result.message);
      router.refresh();
    });
  }

  function drop(id: string): void {
    setItems((list) => list.filter((item) => item.id !== id));
  }

  return { items, move, drop, announcement, error, pending };
}

/** Chetga yetgan qatorda bosilgan tugma yoʻqoladi, shu sabab fokus qarama-qarshi tugmaga oʻtadi. */
export function focusMoved(listId: string, key: string, edge: "up" | "down"): void {
  requestAnimationFrame(() => document.getElementById(`${listId}-${edge}-${key}`)?.focus());
}
