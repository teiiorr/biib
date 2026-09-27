"use client";

import { fill } from "@/i18n/format";
import { UPOP_COPY } from "@/lib/admin/copy-upop";
import { MEDIA_ROLES, type ProjectDraft } from "@/lib/admin/org/project";
import type { MediaRole, ProjectMediaFile } from "@/lib/admin/org/types";

import { AdminIcon } from "./AdminIcon";
import { FieldGroup } from "./FieldGroup";
import { LocaleField } from "./LocaleField";
import { MediaThumb } from "./MediaThumb";
import type { OrgSectionProps } from "./useOrgEditor";

interface UpopMediaGroupProps extends OrgSectionProps<ProjectDraft> {
  readonly files: Readonly<Partial<Record<MediaRole, ProjectMediaFile>>>;
}

const P = UPOP_COPY.project;

/**
 * Sahna halqasi, film va logotip: fayllar faqat koʻrsatiladi (hozircha kodda), tavsiflari esa besh
 * tilda tahrirlanadi.
 */
export function UpopMediaGroup({ draft, patch, errors, idFor, files }: UpopMediaGroupProps) {
  return (
    <FieldGroup id={idFor("media-group")} title={P.groups.media}>
      <p className="admin-note admin-note-info t-small" role="note">
        <AdminIcon name="alert" size={16} />
        <span>{P.videoNote}</span>
      </p>
      {MEDIA_ROLES.map((role) => {
        const alt = draft.alts[role];
        if (!alt) return null;
        const file = files[role];
        const name = P.roles[role];
        return (
          <div key={role} className="admin-media-role">
            <div className="admin-media-file">
              <MediaThumb
                item={file?.preview ?? null}
                alt={alt.uz || name}
                ratio={role === "wordmark" ? "1:1" : "3:2"}
                sizes="(min-width: 600px) 200px, 100vw"
                className="admin-media-thumb"
              />
              <p className="t-small text-ink-2">
                <span className="t-label text-ink">{name}</span>
                <br />
                {fill(P.file, { name: file?.file.split("/").at(-1) ?? "" })}
              </p>
            </div>
            <LocaleField
              id={idFor(`alt-${role}`)}
              label={fill(P.altOf, { role: name })}
              hint={P.altHint}
              value={alt}
              onChange={(value) => patch({ alts: { ...draft.alts, [role]: value } })}
              path={`alt-${role}`}
              errors={errors}
              required
            />
          </div>
        );
      })}
    </FieldGroup>
  );
}
