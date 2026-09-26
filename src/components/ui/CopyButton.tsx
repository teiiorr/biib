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
  /** Faqat belgi (ixcham kartalarda): yorliq aria-label boʻlib qoladi, holat baribir eʼlon qilinadi. */
  readonly iconOnly?: boolean;
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
  iconOnly = false,
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
      {iconOnly ? (
        <Button
          variant={variant}
          size={size}
          icon={state === "copied" ? "check" : "copy"}
          iconOnly
          aria-label={text}
          title={text}
          onClick={() => void copy()}
          {...(className ? { className } : {})}
        />
      ) : (
        <Button
          variant={variant}
          size={size}
          icon={state === "copied" ? "check" : "copy"}
          onClick={() => void copy()}
          {...(className ? { className } : {})}
        >
          {text}
        </Button>
      )}
      <VisuallyHidden role="status" aria-live="polite">
        {state === "idle" ? "" : text}
      </VisuallyHidden>
    </>
  );
}
