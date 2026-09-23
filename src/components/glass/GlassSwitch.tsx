"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";

export interface GlassSwitchProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: string;
  readonly hint?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Harakat va Ovoz uchun kalit: butun qator 44 px bosiladigan maydon. */
export function GlassSwitch({
  checked,
  onCheckedChange,
  label,
  hint,
  disabled = false,
  className,
}: GlassSwitchProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("glass-switch-row", className)}>
      <span className="glass-switch-text">
        <span id={id} className="t-label text-material-ink">
          {label}
        </span>
        {hint ? (
          <span id={hintId} className="t-micro glass-switch-hint">
            {hint}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        aria-describedby={hintId}
        disabled={disabled}
        className="glass-switch"
        onClick={() => onCheckedChange(!checked)}
      >
        <span className="glass-switch-knob" aria-hidden="true" />
      </button>
    </div>
  );
}
