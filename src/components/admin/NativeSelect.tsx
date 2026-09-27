"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Icon } from "@/components/icons/Icon";
import { Field } from "@/components/ui/Field";
import { INPUT_CLASS } from "@/components/ui/Input";
import { cx } from "@/lib/cx";

export interface SelectOption<V extends string> {
  readonly value: V;
  readonly label: string;
}

export interface NativeSelectProps<V extends string> {
  readonly id: string;
  readonly label: ReactNode;
  readonly hint?: string;
  readonly error?: string | undefined;
  readonly value: V;
  readonly options: readonly SelectOption<V>[];
  readonly onChange: (value: V) => void;
  readonly className?: string;
}

/**
 * Tabiiy tanlash roʻyxati (telefonda tizim gʻildiragi): maydon bilan bir xil 48 px, 16 px matn va oʻngda
 * chevron. Yorliq, izoh va xato Field orqali.
 */
export function NativeSelect<V extends string>({
  id,
  label,
  hint,
  error,
  value,
  options,
  onChange,
  className,
}: NativeSelectProps<V>) {
  const ref = useRef<HTMLSelectElement | null>(null);
  /* Server amalidan keyin React shaklni tiklaydi (form.reset): select dastlabki tanloviga qaytib,
     holatdan ajralib qolmasin — boshlangʻich tanlov doim joriy qiymatga tenglanadi. */
  useEffect(() => {
    for (const option of ref.current?.options ?? [])
      option.defaultSelected = option.value === value;
  }, [value, options]);
  return (
    <Field
      id={id}
      label={label}
      {...(hint ? { hint } : {})}
      error={error}
      className={cx("admin-select", className)}
    >
      {(control) => (
        <span className="admin-select-box">
          <select
            {...control}
            ref={ref}
            className={cx(INPUT_CLASS, "admin-select-input h-12 pr-12 pl-4")}
            value={value}
            onChange={(event) => {
              const next = options.find((option) => option.value === event.target.value);
              if (next) onChange(next.value);
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={20} className="admin-select-chevron" />
        </span>
      )}
    </Field>
  );
}
