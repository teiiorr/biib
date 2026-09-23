import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FormMessage } from "./FormMessage";
import { VisuallyHidden } from "./VisuallyHidden";

export interface FieldControlProps {
  readonly id: string;
  readonly "aria-describedby": string | undefined;
  readonly "aria-invalid": true | undefined;
  readonly required: boolean;
}

export interface FieldProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly hint?: ReactNode;
  readonly error?: ReactNode;
  readonly required?: boolean;
  /** Yulduzcha oʻrniga oʻqiladigan matn, masalan «majburiy». */
  readonly requiredLabel?: string;
  readonly className?: string;
  /** Boshqaruv elementi: id, aria-describedby, aria-invalid, required shu yerdan keladi. */
  readonly children: (control: FieldControlProps) => ReactNode;
}

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  requiredLabel,
  className,
  children,
}: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="t-label text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-tint">
              {" *"}
            </span>
            {requiredLabel ? <VisuallyHidden> ({requiredLabel})</VisuallyHidden> : null}
          </>
        ) : null}
      </label>
      {children({
        id,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {hint ? (
        <p id={hintId} className="t-small text-ink-3">
          {hint}
        </p>
      ) : null}
      <FormMessage id={errorId} tone="error">
        {error}
      </FormMessage>
    </div>
  );
}
