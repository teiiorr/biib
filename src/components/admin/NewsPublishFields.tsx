"use client";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { NEWS_COPY } from "@/lib/admin/copy-news";

import type { EditorSectionProps } from "./news-editor-shared";
import { SlugField, type SlugFieldProps } from "./SlugField";
import { StatusField } from "./StatusField";
import { SwatchField } from "./SwatchField";

interface NewsPublishFieldsProps extends EditorSectionProps {
  readonly slug: Pick<SlugFieldProps, "savedSlug" | "locked" | "check" | "onChange">;
}

const T = NEWS_COPY.editor;

/** Chop etish: holat, sana, havola va rang. */
export function NewsPublishFields({ draft, patch, errors, idFor, slug }: NewsPublishFieldsProps) {
  return (
    <>
      <StatusField
        id={idFor("status")}
        legend={T.status}
        value={draft.status}
        onChange={(status) => patch({ status })}
        hints={NEWS_COPY.statusHint}
      />
      <Field id={idFor("date")} label={T.date} error={errors.date} className="admin-date">
        {(control) => (
          <Input
            {...control}
            type="date"
            value={draft.date}
            onChange={(event) => patch({ date: event.target.value })}
          />
        )}
      </Field>
      <SlugField
        id={idFor("slug")}
        value={draft.slug}
        mode={draft.slugMode}
        error={errors.slug}
        {...slug}
      />
      <SwatchField
        id={idFor("color")}
        legend={T.color}
        hint={T.colorHint}
        itemLabel={T.swatch}
        value={draft.story.primary}
        onChange={(primary) => patch({ story: { ...draft.story, primary } })}
        preview={draft.topic.uz || T.topic}
      />
    </>
  );
}
