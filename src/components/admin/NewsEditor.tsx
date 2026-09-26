"use client";

import { useActionState, useEffect, useId, useState, type FormEvent } from "react";

import type { ContentStatus, Localized } from "@/content/types";
import { pathFor } from "@/i18n/routes";
import { saveNews } from "@/lib/admin/actions/news";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { buildNews } from "@/lib/admin/news/build";
import { draftFromAdmin, draftKey, draftToPayload } from "@/lib/admin/news/draft";
import type { FieldErrors, MediaItem, NewsDraft, SaveNewsState } from "@/lib/admin/news/types";
import { slugFromUz } from "@/lib/admin/slug";

import { firstErrorId, focusField } from "./editor-focus";
import { FieldGroup } from "./FieldGroup";
import { FIELD_ORDER } from "./news-editor-shared";
import { NewsMediaFields } from "./NewsMediaFields";
import { NewsPublishFields } from "./NewsPublishFields";
import { NewsTextFields } from "./NewsTextFields";
import { SaveBar } from "./SaveBar";
import { useLeaveGuard } from "./useLeaveGuard";
import { useSlugCheck } from "./useSlugCheck";
import { saveBarState } from "./save-state";

export interface NewsEditorProps {
  /** null: yangi yangilik (saqlangach oʻz sahifasiga oʻtiladi). */
  readonly id: string | null;
  readonly initial: NewsDraft;
  readonly updatedAt: string | null;
  /** Bazadagi holat: tasdiqlangan boʻlsa havola qulflanadi. */
  readonly savedStatus: ContentStatus | null;
  /** Yangi yozuv hozirgina saqlanib shu sahifaga kelindi. */
  readonly justSaved: boolean;
  readonly library: readonly MediaItem[];
}

const IDLE: SaveNewsState = { status: "idle", revision: 0 };
const G = NEWS_COPY.editor.groups;

/**
 * Yangilik tahriri: tabiiy shakl, holat JSON yashirin maydonda server amaliga ketadi. Brauzer ham
 * xuddi server kabi tekshiradi (build.ts): xato boʻlsa soʻrov ketmaydi va fokus birinchi xatoga oʻtadi.
 */
export function NewsEditor({
  id,
  initial,
  updatedAt,
  savedStatus,
  justSaved,
  library,
}: NewsEditorProps) {
  const [state, formAction, pending] = useActionState(saveNews, IDLE);
  const [draft, setDraft] = useState(initial);
  const [baseline, setBaseline] = useState(() => draftKey(initial));
  const [saved, setSaved] = useState({
    updatedAt,
    status: savedStatus,
    slug: id ? initial.slug : null,
  });
  const [seen, setSeen] = useState(state.revision);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [uploads, setUploads] = useState(0);
  const [media, setMedia] = useState(library);
  const slugCheck = useSlugCheck(id);
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;

  /* Server javobi kelgan render: saqlangan (meʼyorlangan) qiymatlar tahrirga qaytadi. */
  if (state.revision !== seen) {
    setSeen(state.revision);
    if (state.status === "saved") {
      const known = new Map(
        [...(draft.cover ? [draft.cover] : []), ...draft.photos].map((m) => [m.id, m]),
      );
      const next = draftFromAdmin(state.data, known);
      setDraft(next);
      setBaseline(draftKey(next));
      setSaved({ updatedAt: state.updatedAt, status: state.data.status, slug: state.data.slug });
    }
  }

  const errors =
    Object.keys(clientErrors).length || state.status !== "invalid" ? clientErrors : state.errors;
  const dirty = draftKey(draft) !== baseline;
  const focusIdFor = (field: string) =>
    field === "photos"
      ? `${idFor("photos")}-upload`
      : field === "coverAlt"
        ? `${idFor("cover")}-alt`
        : idFor(field);
  const serverTarget =
    state.status === "invalid" ? firstErrorId(state.errors, FIELD_ORDER, focusIdFor) : null;
  useLeaveGuard(dirty && !pending, NEWS_COPY.save.leave);
  /* Server rad etgan har javobda (bir xil xato qayta kelsa ham) fokus birinchi xatoga. */
  useEffect(() => {
    if (serverTarget) focusField(serverTarget);
  }, [state, serverTarget]);

  const patch = (next: Partial<NewsDraft>) => setDraft((d) => ({ ...d, ...next }));
  function changeTitle(title: Localized): void {
    const slug = draft.slugMode === "auto" ? slugFromUz(title.uz) : draft.slug;
    patch({ title, slug });
    if (draft.slugMode === "auto") slugCheck.schedule(slug);
  }
  function addPhotos(items: readonly MediaItem[]): void {
    setDraft((d) => {
      const used = new Set([...d.photos.map((p) => p.id), ...(d.cover ? [d.cover.id] : [])]);
      return { ...d, photos: [...d.photos, ...items.filter((item) => !used.has(item.id))] };
    });
  }
  function uploaded(items: readonly MediaItem[]): void {
    setMedia((list) => [...items, ...list.filter((m) => !items.some((i) => i.id === m.id))]);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    const result = buildNews(draftToPayload(draft, id, saved.updatedAt));
    if (uploads > 0 || !result.ok) event.preventDefault();
    if (result.ok) {
      setClientErrors({});
      return;
    }
    setClientErrors(result.errors);
    const target = firstErrorId(result.errors, FIELD_ORDER, focusIdFor);
    if (target) focusField(target);
  }

  const bar = saveBarState({ state, pending, dirty, uploads, justSaved, errors });
  const shared = { draft, patch, errors, idFor };
  return (
    <form action={formAction} onSubmit={submit} className="admin-editor" noValidate>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify(draftToPayload(draft, id, saved.updatedAt))}
      />
      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <FieldGroup id={idFor("publish-group")} title={G.publish}>
            <NewsPublishFields
              {...shared}
              slug={{
                savedSlug: saved.slug,
                locked: saved.status === "confirmed",
                check: slugCheck.result,
                onChange: (slug) => {
                  patch({ slug, slugMode: "manual" });
                  slugCheck.schedule(slug);
                },
              }}
            />
          </FieldGroup>
          <FieldGroup id={idFor("text-group")} title={G.text}>
            <NewsTextFields {...shared} onTitle={changeTitle} />
          </FieldGroup>
        </div>
        <div className="admin-editor-side">
          <NewsMediaFields
            {...shared}
            library={media}
            onUploaded={uploaded}
            onBusy={(delta) => setUploads((n) => n + delta)}
            onAddPhotos={addPhotos}
          />
        </div>
      </div>
      <SaveBar
        message={bar.message}
        tone={bar.tone}
        saving={pending}
        blockedReason={uploads > 0 ? NEWS_COPY.save.uploading : null}
        viewHref={saved.slug ? pathFor("uz", "newsItem", saved.slug) : null}
      />
    </form>
  );
}
