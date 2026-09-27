"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FormMessage } from "@/components/ui/FormMessage";
import { fill } from "@/i18n/format";
import { deleteMedia } from "@/lib/admin/actions/media";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import type { LibraryItem } from "@/lib/admin/media/library-types";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";
import { FieldGroup } from "./FieldGroup";
import { MediaCard } from "./MediaCard";
import { UploadDrop } from "./UploadDrop";

type Filter = "all" | "unused";

const M = SYSTEM_COPY.media;
const FILTERS: readonly Filter[] = ["all", "unused"];

/**
 * Media kutubxonasi: yuklash, «Ishlatilmagan» filtri va fayllar toʻri. Yuklangach sahifa serverdan
 * qayta oʻqiladi (ishlatilish soni bazadan); oʻchirish bitta tasdiq oynasi orqali.
 */
export function MediaLibrary({ items }: { readonly items: readonly LibraryItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [target, setTarget] = useState<LibraryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const unused = items.filter((item) => item.uses === 0);
  const shown = filter === "unused" ? unused : items;

  /* Yuklash holatini UploadDrop oʻzi koʻrsatadi; bu yerda faqat roʻyxat bazadan qayta oʻqiladi. */
  function uploaded(): void {
    setNotice(null);
    router.refresh();
  }

  function remove(): void {
    const item = target;
    if (!item) return;
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setTarget(null);
      setNotice(fill(result.filesLeft ? M.removedLeft : M.removed, { name: item.name }));
    });
  }

  return (
    <>
      <FieldGroup id="admin-media-upload" title={M.upload}>
        <UploadDrop
          id="admin-media-files"
          purpose="photo"
          multiple
          label={M.uploadLabel}
          onUploaded={uploaded}
        />
        <p className="t-small text-ink-3">{M.uploadHint}</p>
      </FieldGroup>
      <FormMessage tone="success">{notice}</FormMessage>
      <div className="admin-media-bar">
        <fieldset className="admin-filter">
          <legend className="sr-only">{M.filter}</legend>
          {FILTERS.map((value) => (
            <label key={value} className="admin-filter-option">
              <input
                type="radio"
                name="admin-media-filter"
                value={value}
                checked={filter === value}
                onChange={() => setFilter(value)}
                className="sr-only"
              />
              <span className="t-label">{value === "all" ? M.all : M.unused}</span>
              <span className="admin-filter-count t-micro tnum">
                {value === "all" ? items.length : unused.length}
              </span>
            </label>
          ))}
        </fieldset>
        <p className="t-small text-ink-3">{M.staticNote}</p>
      </div>
      {shown.length ? (
        <ul className="admin-media-grid" aria-label={fill(M.count, { n: shown.length })}>
          {shown.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onDelete={() => {
                setError(null);
                setTarget(item);
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="t-body text-ink-2">{filter === "unused" ? M.emptyUnused : M.empty}</p>
      )}
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title={M.removeTitle}
        text={fill(M.removeText, { name: target?.name ?? "" })}
        confirmLabel={M.remove}
        confirmGraphic={<AdminIcon name="trash" size={20} />}
        onConfirm={remove}
        pending={pending}
        error={error}
        danger
      />
    </>
  );
}
