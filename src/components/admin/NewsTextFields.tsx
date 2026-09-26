"use client";

import type { Localized } from "@/content/types";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { LEAD_MAX, TITLE_MAX } from "@/lib/admin/news/build";

import { LocaleField } from "./LocaleField";
import { LocaleListField } from "./LocaleListField";
import type { EditorSectionProps } from "./news-editor-shared";

interface NewsTextFieldsProps extends EditorSectionProps {
  /** Sarlavha alohida: oʻzbekchasidan havola ham chiqadi. */
  readonly onTitle: (next: Localized) => void;
}

const T = NEWS_COPY.editor;

/** Matn: mavzu, sarlavha, qisqa matn, asosiy matn (tablar) va ixtiyoriy iqtibos — besh tilda. */
export function NewsTextFields({ draft, patch, errors, idFor, onTitle }: NewsTextFieldsProps) {
  return (
    <>
      <LocaleField
        id={idFor("topic")}
        label={T.topic}
        hint={T.topicHint}
        value={draft.topic}
        onChange={(topic) => patch({ topic })}
        path="topic"
        errors={errors}
        required
      />
      <LocaleField
        id={idFor("title")}
        label={T.title}
        hint={T.titleHint}
        value={draft.title}
        onChange={onTitle}
        path="title"
        errors={errors}
        max={TITLE_MAX}
        required
      />
      <LocaleField
        id={idFor("lead")}
        label={T.lead}
        hint={T.leadHint}
        value={draft.lead}
        onChange={(lead) => patch({ lead })}
        path="lead"
        errors={errors}
        max={LEAD_MAX}
        multiline
        required
      />
      <LocaleListField
        id={idFor("body")}
        label={T.body}
        hint={T.bodyHint}
        value={draft.body}
        onChange={(body) => patch({ body })}
        path="body"
        errors={errors}
        required
      />
      <LocaleField
        id={idFor("quote")}
        label={T.quote}
        hint={T.quoteHint}
        value={draft.quote}
        onChange={(quote) => patch({ quote })}
        path="quote"
        errors={errors}
        multiline
      />
    </>
  );
}
