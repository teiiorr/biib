"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import type { ButtonSize, ButtonVariant } from "./button-variants";
import { VisuallyHidden } from "./VisuallyHidden";

export interface CopyButtonProps {
  readonly value: string;
  readonly label: string;
  readonly copiedLabel: string;
  /** Clipboard ruxsat bermasa koʻrsatiladi. */
  readonly failedLabel?: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
}

type CopyState = "idle" | "copied" | "failed";

export function CopyButton({
  value,
  label,
  copiedLabel,
  failedLabel,
  variant = "glass",
  size = "48",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const text =
    state === "copied" ? copiedLabel : state === "failed" ? (failedLabel ?? label) : label;
  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon={state === "copied" ? "check" : "copy"}
        onClick={() => void copy()}
        {...(className ? { className } : {})}
      >
        {text}
      </Button>
      <VisuallyHidden role="status" aria-live="polite">
        {state === "idle" ? "" : text}
      </VisuallyHidden>
    </>
  );
}
