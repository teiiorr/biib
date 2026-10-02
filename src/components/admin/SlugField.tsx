"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { fill } from "@/i18n/format";
import { pathFor } from "@/i18n/routes";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import type { SlugMode } from "@/lib/admin/news/types";

import { AdminIcon } from "./AdminIcon";
import type { SlugCheck } from "./useSlugCheck";

export interface SlugFieldProps {
  readonly id: string;
  readonly value: string;
  readonly mode: SlugMode;
  /** Yozuvning oʻz havolasi, bandlikka tekshirilmaydi. */
  readonly savedSlug: string | null;
  /** Tasdiqlangan yozuv havolasi tarqalgan boʻlishi mumkin, shu sabab oʻzgartirish ogohlantirish bilan. */
  readonly locked: boolean;
  readonly check: SlugCheck["result"];
  readonly error?: string | undefined;
  readonly onChange: (slug: string) => void;
}

const T = NEWS_COPY.editor;

function statusText(props: SlugFieldProps): string {
  const { value, mode, savedSlug, check } = props;
  if (!value || value === savedSlug) return "";
  if (!check || check.slug !== value) return T.slugChecking;
  if (check.free === value) return T.slugFree;
  return mode === "auto" && check.free ? T.slugSuffixed : NEWS_COPY.errors.slugTaken;
}

/** Tasdiqlangach havola qulflanadi; oʻzgartirilsa eski manzil 308 yoʻnaltirish bilan ishlayveradi. */
export function SlugField(props: SlugFieldProps) {
  const { id, value, mode, locked, check, error, onChange } = props;
  const [editing, setEditing] = useState(false);
  const readOnly = locked && !editing;
  const effective = mode === "auto" && check?.slug === value && check.free ? check.free : value;
  const status = readOnly ? "" : statusText(props);
  return (
    <div className="admin-field">
      <label htmlFor={id} className="t-label text-ink">
        {T.slug}
      </label>
      <Input
        id={id}
        value={value}
        readOnly={readOnly}
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={80}
        onChange={(event) => onChange(event.target.value.trim().toLowerCase())}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint ${id}-status${error ? ` ${id}-error` : ""}`}
      />
      <p id={`${id}-hint`} className="t-small text-ink-3">
        {readOnly ? T.slugLocked : T.slugHint}
        {effective ? (
          <>
            {" "}
            <span className="admin-path">
              {fill(T.slugPath, { path: pathFor("uz", "newsItem", effective) })}
            </span>
          </>
        ) : null}
      </p>
      <p id={`${id}-status`} className="t-small text-ink-2" role="status">
        {status}
      </p>
      {readOnly ? (
        <div>
          <Button
            variant="glass"
            size="40"
            graphic={<AdminIcon name="pencil" size={16} />}
            onClick={() => setEditing(true)}
          >
            {T.slugEdit}
          </Button>
        </div>
      ) : null}
      {locked && editing ? (
        <p className="admin-note t-small" role="note">
          <AdminIcon name="alert" size={16} />
          <span>{T.slugWarning}</span>
        </p>
      ) : null}
      <FormMessage id={`${id}-error`} tone="error">
        {error}
      </FormMessage>
    </div>
  );
}
