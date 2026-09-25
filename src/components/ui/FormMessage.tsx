import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type FormMessageTone = "info" | "success" | "error";

export interface FormMessageProps {
  readonly tone?: FormMessageTone;
  readonly id?: string;
  readonly className?: string;
  readonly children?: ReactNode;
}

const TONE_CLASS: Record<FormMessageTone, string> = {
  info: "text-ink-2",
  success: "text-success",
  error: "text-danger",
};

/* Xato assertive (alert), qolgani polite (status); boʻsh boʻlsa ham DOMda turadi, oʻzgarish eʼlon qilinsin. */
export function FormMessage({ tone = "info", id, className, children }: FormMessageProps) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={cx("t-small", TONE_CLASS[tone], !children && "hidden", className)}
    >
      {children}
    </p>
  );
}
