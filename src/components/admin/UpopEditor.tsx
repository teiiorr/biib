"use client";

import { useId } from "react";

import { pathFor } from "@/i18n/routes";
import { saveProject } from "@/lib/admin/actions/project";
import {
  buildProject,
  draftFromProject,
  projectErrorOrder,
  type ProjectDraft,
} from "@/lib/admin/org/project";
import type { MediaRole, ProjectAdmin, ProjectMediaFile } from "@/lib/admin/org/types";

import { SaveBar } from "./SaveBar";
import { UpopBasicsGroup } from "./UpopBasicsGroup";
import { UpopCostGroup } from "./UpopCostGroup";
import { UpopFactsGroup } from "./UpopFactsGroup";
import { UpopHighlightsGroup } from "./UpopHighlightsGroup";
import { UpopMediaGroup } from "./UpopMediaGroup";
import { UpopRegisterGroup } from "./UpopRegisterGroup";
import { useOrgEditor } from "./useOrgEditor";

interface UpopEditorProps {
  /** Panelda tahrirlanmaydigan qismlar tekshiruv uchun shu yozuvdan olinadi. */
  readonly data: ProjectAdmin;
  readonly version: string | null;
  readonly files: Readonly<Partial<Record<MediaRole, ProjectMediaFile>>>;
}

/** UPOP TREND faqat tahrirlanadi: qoʻshish va oʻchirish yoʻq. */
export function UpopEditor({ data, version, files }: UpopEditorProps) {
  const form = useId().replace(/:/g, "");
  const idFor = (field: string) => `${form}-${field}`;
  const editor = useOrgEditor({
    action: saveProject,
    initial: draftFromProject(data),
    version,
    keyOf: (draft) => JSON.stringify(draft),
    check: (draft) => {
      const built = buildProject(draft, data);
      return built.ok ? {} : built.errors;
    },
    fromSaved: (saved) => draftFromProject(saved),
    errorOrder: projectErrorOrder,
    idFor,
  });
  const { draft, setDraft, errors } = editor;
  const shared = {
    draft,
    patch: (next: Partial<ProjectDraft>) => setDraft((d) => ({ ...d, ...next })),
    errors,
    idFor,
  };
  return (
    <form action={editor.formAction} onSubmit={editor.submit} className="admin-editor" noValidate>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify({ draft, expected: editor.version })}
      />
      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <UpopBasicsGroup {...shared} />
          <UpopFactsGroup {...shared} />
          <UpopCostGroup {...shared} />
          <UpopRegisterGroup {...shared} />
        </div>
        <div className="admin-editor-side">
          <UpopHighlightsGroup {...shared} />
          <UpopMediaGroup {...shared} files={files} />
        </div>
      </div>
      <SaveBar
        message={editor.bar.message}
        tone={editor.bar.tone}
        saving={editor.pending}
        viewHref={pathFor("uz", "projects")}
      />
    </form>
  );
}
