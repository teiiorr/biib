"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { fill } from "@/i18n/format";
import { ORG_COPY } from "@/lib/admin/copy-org";
import type { FieldErrors } from "@/lib/admin/news/types";
import { normalizePhone } from "@/lib/admin/org/fields";

import { AdminIcon } from "./AdminIcon";
import { ReorderButtons } from "./ReorderButtons";

interface PhonesFieldProps {
  /** id qiymatlari xato kalitlari bilan bir xil: phone-N maydonlar va phones-add tugmasi. */
  readonly idFor: (field: string) => string;
  readonly value: readonly string[];
  readonly onChange: (next: readonly string[]) => void;
  readonly errors: FieldErrors;
}

const C = ORG_COPY.contacts;

/**
 * Maydondan chiqqanda raqam «+998 XX XXX XX XX» koʻrinishiga keltiriladi. Birinchi raqam sayt
 * futerida chiqadi.
 */
export function PhonesField({ idFor, value, onChange, errors }: PhonesFieldProps) {
  const [announcement, setAnnouncement] = useState("");
  const addId = idFor("phones-add");
  const hintId = idFor("phones-hint");

  function set(index: number, text: string): void {
    onChange(value.map((phone, i) => (i === index ? text : phone)));
  }

  function remove(index: number): void {
    onChange(value.filter((_, i) => i !== index));
    setAnnouncement(C.phoneRemoved);
    requestAnimationFrame(() => document.getElementById(addId)?.focus());
  }

  function add(): void {
    onChange([...value, ""]);
    requestAnimationFrame(() => document.getElementById(idFor(`phone-${value.length}`))?.focus());
  }

  return (
    <fieldset className="admin-locale" aria-describedby={hintId}>
      <legend className="t-label text-ink">{C.phones}</legend>
      <p id={hintId} className="t-small text-ink-3">
        {C.phonesHint}
      </p>
      {value.length ? (
        <ol className="admin-rows">
          {value.map((phone, index) => {
            const inputId = idFor(`phone-${index}`);
            const label = fill(C.phoneN, { n: index + 1 });
            const error = errors[`phone-${index}`];
            return (
              <li key={index} className="admin-row">
                <label htmlFor={inputId} className="sr-only">
                  {label}
                </label>
                <Input
                  id={inputId}
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  enterKeyHint="next"
                  className="admin-row-grow"
                  value={phone}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  onChange={(event) => set(index, event.target.value)}
                  onBlur={() => {
                    const normalized = normalizePhone(phone);
                    if (normalized && normalized !== phone) set(index, normalized);
                  }}
                />
                <span className="admin-row-tools">
                  <ReorderButtons
                    idAt={(at) => `${idFor(`phone-${at}`)}-move`}
                    item={phone.trim() || label}
                    index={index}
                    count={value.length}
                    onMove={(to) => {
                      const next = [...value];
                      const [moved] = next.splice(index, 1);
                      if (moved === undefined) return;
                      next.splice(to, 0, moved);
                      onChange(next);
                    }}
                    onAnnounce={setAnnouncement}
                  />
                  <Button
                    variant="glass"
                    size="48"
                    iconOnly
                    aria-label={fill(C.phoneRemove, { n: index + 1 })}
                    graphic={<AdminIcon name="trash" size={20} />}
                    onClick={() => remove(index)}
                  />
                </span>
                <FormMessage id={`${inputId}-error`} tone="error" className="admin-row-full">
                  {error}
                </FormMessage>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="t-small text-ink-2">{C.phonesEmpty}</p>
      )}
      <p className="sr-only" role="status">
        {announcement}
      </p>
      <div className="admin-actions">
        <Button
          id={addId}
          variant="glass"
          size="48"
          graphic={<AdminIcon name="plus" size={20} />}
          aria-describedby={errors["phones-add"] ? `${addId}-error` : undefined}
          onClick={add}
        >
          {C.phoneAdd}
        </Button>
      </div>
      <FormMessage id={`${addId}-error`} tone="error">
        {errors["phones-add"]}
      </FormMessage>
    </fieldset>
  );
}
