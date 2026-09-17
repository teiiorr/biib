"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Segment boşqaruvi. İçida oddiy radio lar — strelkalar bilan yuriş va
 * ekran öqigiç semantikasi tekinga keladi. Tanlov plaşkasi qattiq va
 * transform bilan suradi, kenglik hisoblanmaydi.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (next: T) => void;
  className?: string;
}) {
  const name = useId();
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="sr-only">{label}</legend>

      <div
        className="glass glass--thin relative grid rounded-sm p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 rounded-xs bg-elevated shadow-contact",
            "transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)]",
          )}
          style={{
            width: `calc((100% - 0.5rem) / ${options.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />

        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const active = option.value === value;
          return (
            <div key={option.value} className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "tap flex h-8 cursor-pointer items-center justify-center rounded-xs px-2",
                  // Uzun tarjima qatorga sigʻmasa kesiladi, qöşnisiga çiqmaydi.
                  "min-w-0 truncate whitespace-nowrap",
                  "text-footnote font-semibold transition-colors duration-[var(--dur-fast)]",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                  active ? "text-label" : "text-label-secondary",
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
