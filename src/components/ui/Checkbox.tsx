import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "children" | "className" | "size"
> {
  readonly id: string;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly className?: string;
}

/* Tabiiy input, appearance yoʻq; sezish maydoni yorliq orqali 48 px. */
export function Checkbox({ id, label, description, className, ...rest }: CheckboxProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <label
      htmlFor={id}
      className={cn("flex min-h-12 cursor-pointer items-start gap-3 py-3", className)}
    >
      <span className="relative size-6 shrink-0">
        <input
          id={id}
          type="checkbox"
          aria-describedby={descriptionId}
          className="peer size-6 cursor-pointer appearance-none rounded-s border border-line-strong bg-surface checked:border-tint checked:bg-tint disabled:cursor-not-allowed disabled:bg-surface-2"
          {...rest}
        />
        <Icon
          name="check"
          size={16}
          className="pointer-events-none absolute top-1 left-1 text-on-tint opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className="flex flex-col gap-1">
        <span className="t-body text-ink">{label}</span>
        {description ? (
          <span id={descriptionId} className="t-small text-ink-3">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
