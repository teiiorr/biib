import type { ContentStatus } from "@/content/types";
import { ADMIN_COPY } from "@/lib/admin/copy";

const STATUSES: readonly ContentStatus[] = ["confirmed", "draft", "pending"];

export interface StatusFieldProps {
  readonly id: string;
  readonly legend: string;
  readonly value: ContentStatus;
  readonly onChange: (status: ContentStatus) => void;
  /** Holat saytda nima qilishi yozuv turiga qarab farq qiladi. */
  readonly hints: Readonly<Record<ContentStatus, string>>;
}

export function StatusField({ id, legend, value, onChange, hints }: StatusFieldProps) {
  return (
    <fieldset className="admin-choice">
      <legend className="t-label text-ink">{legend}</legend>
      <div className="admin-choice-list">
        {STATUSES.map((status) => {
          const hintId = `${id}-${status}-hint`;
          return (
            <label key={status} className="admin-radio">
              <input
                type="radio"
                name={id}
                value={status}
                checked={value === status}
                onChange={() => onChange(status)}
                aria-describedby={hintId}
              />
              <span className="admin-radio-text t-body text-ink">
                {ADMIN_COPY.statuses[status]}
                <span id={hintId} className="t-small text-ink-3">
                  {hints[status]}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
