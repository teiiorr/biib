"use client";

import { useId, useState } from "react";

import { fill } from "@/i18n/format";
import { pathFor } from "@/i18n/routes";
import { saveGallery } from "@/lib/admin/actions/upop";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import {
  buildShots,
  compactSlots,
  galleryErrorOrder,
  galleryFromUpload,
  hasGap,
  newSlot,
  posterOf,
  slotPayload,
  type GallerySlots,
} from "@/lib/admin/org/gallery";
import type { GalleryMedia, GallerySlot } from "@/lib/admin/org/types";

import { AdminIcon } from "./AdminIcon";
import { GalleryEmptySlot } from "./GalleryEmptySlot";
import { GalleryMap } from "./GalleryMap";
import { GallerySlotCard } from "./GallerySlotCard";
import { SaveBar } from "./SaveBar";
import { useOrgEditor } from "./useOrgEditor";

interface GalleryEditorProps {
  readonly initial: GallerySlots;
  /** Bazadagi galereya izi: boshqa oynada oʻzgargan boʻlsa saqlash rad etiladi. */
  readonly version: string;
  readonly library: readonly GalleryMedia[];
}

const G = UPOP_COPY.gallery;

/**
 * UPOP galereyasi: tepada saytdagi toʻrning kichik nusxasi, ostida sakkiz joy kartasi (kompyuterda
 * 1-joy toʻliq kenglikda). Hammasi bitta saqlash bilan: joylar almashishi bir tranzaksiyada.
 */
export function GalleryEditor({ initial, version, library }: GalleryEditorProps) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const [media, setMedia] = useState(library);
  const [uploads, setUploads] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const editor = useOrgEditor({
    action: saveGallery,
    initial: { slots: initial },
    version,
    keyOf: (draft) => JSON.stringify(draft.slots.map(slotPayload)),
    check: (draft) => {
      const built = buildShots(draft.slots.map(slotPayload));
      return built.ok ? {} : built.errors;
    },
    fromSaved: (saved, draft) => ({ slots: compactSlots(draft.slots, saved) }),
    errorOrder: galleryErrorOrder,
    idFor,
    uploads,
  });
  const { draft, setDraft } = editor;
  const images = media.flatMap((m) =>
    m.kind === "image" ? [{ id: m.id, src: m.previewSrc, image: m.preview }] : [],
  );

  function setSlot(index: number, slot: GallerySlot | null): void {
    setDraft((d) => ({ slots: d.slots.map((s, i) => (i === index ? slot : s)) }));
  }

  function place(index: number, picked: GalleryMedia): void {
    setSlot(index, newSlot(index, picked, posterOf(picked)));
    setAnnouncement(fill(G.added, { n: index + 1 }));
  }

  function move(from: number, to: number): void {
    setDraft((d) => {
      const next = [...d.slots];
      [next[from], next[to]] = [next[to] ?? null, next[from] ?? null];
      return { slots: next };
    });
  }

  function clear(index: number): void {
    setSlot(index, null);
    setAnnouncement(fill(G.cleared, { n: index + 1 }));
    requestAnimationFrame(() => document.getElementById(idFor(`slot${index + 1}-add`))?.focus());
  }

  return (
    <form action={editor.formAction} onSubmit={editor.submit} className="admin-editor" noValidate>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({ slots: draft.slots.map(slotPayload), version: editor.version })}
      />
      <p className="t-body text-ink-2">{G.intro}</p>
      <GalleryMap slots={draft.slots} idFor={idFor} />
      {hasGap(draft.slots) ? (
        <p className="admin-note admin-note-info t-small" role="note">
          <AdminIcon name="alert" size={16} />
          <span>{G.gap}</span>
        </p>
      ) : null}
      <ol className="admin-gallery-slots">
        {draft.slots.map((slot, index) => (
          <li key={index} className="admin-item" data-slot={index + 1}>
            {slot ? (
              <GallerySlotCard
                index={index}
                slot={slot}
                idFor={idFor}
                errors={editor.errors}
                library={media}
                images={images}
                onChange={(next) => setSlot(index, next)}
                onReplace={(picked) =>
                  setSlot(index, { ...slot, media: picked, poster: posterOf(picked) })
                }
                onMove={(to) => move(index, to)}
                onClear={() => clear(index)}
                onAnnounce={setAnnouncement}
              />
            ) : (
              <GalleryEmptySlot
                index={index}
                idFor={idFor}
                library={media}
                onPick={(picked) => place(index, picked)}
                onUploaded={(items) => {
                  const uploaded = items.map(galleryFromUpload);
                  setMedia((list) => [
                    ...uploaded,
                    ...list.filter((m) => !items.some((i) => i.id === m.id)),
                  ]);
                  if (uploaded[0]) place(index, uploaded[0]);
                }}
                onBusy={(delta) => setUploads((n) => n + delta)}
              />
            )}
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">
        {announcement}
      </p>
      <SaveBar
        message={editor.bar.message}
        tone={editor.bar.tone}
        saving={editor.pending}
        blockedReason={uploads > 0 ? NEWS_COPY.save.uploading : null}
        viewHref={pathFor("uz", "projects")}
      />
    </form>
  );
}
