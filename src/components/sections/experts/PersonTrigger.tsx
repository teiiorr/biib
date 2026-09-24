"use client";

import type { ButtonHTMLAttributes, Ref } from "react";

export interface PersonDialogProps {
  readonly name: string;
  readonly role: string;
  readonly field: string | null;
  readonly bio: string;
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly dialogLabel: string;
}

interface PersonTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly label: string;
  readonly ref?: Ref<HTMLButtonElement>;
}

export function PersonTrigger({ label, ref, ...rest }: PersonTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="people-open t-label"
      aria-haspopup="dialog"
      {...rest}
    >
      {label}
    </button>
  );
}
