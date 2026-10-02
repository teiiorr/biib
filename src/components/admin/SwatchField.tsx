import type { CSSProperties } from "react";

import type { ArtSlot } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";

const SLOTS: readonly ArtSlot[] = ["art-1", "art-2", "art-3", "art-4", "art-5", "art-6", "art-7"];

export interface SwatchFieldProps {
  readonly id: string;
  readonly legend: string;
  readonly hint: string;
  /** Har namuna nomi, masalan «{n}-rang». */
  readonly itemLabel: string;
  readonly value: ArtSlot;
  readonly onChange: (slot: ArtSlot) => void;
  readonly preview: string;
}

export function SwatchField({
  id,
  legend,
  hint,
  itemLabel,
  value,
  onChange,
  preview,
}: SwatchFieldProps) {
  return (
    <fieldset className="admin-choice" aria-describedby={`${id}-hint`}>
      <legend className="t-label text-ink">{legend}</legend>
      <p id={`${id}-hint`} className="t-small text-ink-3">
        {hint}
      </p>
      <div className="admin-swatches">
        {SLOTS.map((slot, index) => (
          <label
            key={slot}
            className="admin-swatch"
            style={{ "--swatch": `var(--${slot})` } as CSSProperties}
          >
            <input
              type="radio"
              name={id}
              value={slot}
              checked={value === slot}
              onChange={() => onChange(slot)}
              className="sr-only"
            />
            <span className="sr-only">{fill(itemLabel, { n: index + 1 })}</span>
          </label>
        ))}
      </div>
      <div>
        <Tag tone={value}>{preview}</Tag>
      </div>
    </fieldset>
  );
}
