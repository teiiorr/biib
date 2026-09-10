import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const CONTROL = [
  "w-full rounded-field border-2 border-line bg-surface px-4 py-3",
  "text-[1.02rem] text-ink placeholder:text-ink-muted",
  "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-micro)]",
  "hover:border-line-strong",
  "focus:border-blue-cta focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]",
  "aria-[invalid=true]:border-coral-ink",
].join(" ");

export interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  /** Xato matni. Bölsa — aria-describedby orqali bağlanadi. */
  error?: string;
  hint?: string;
  className?: string;
}

export function Field({ id, label, children, error, hint, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="font-display text-[0.98rem] font-bold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-[0.9rem] text-ink-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[0.92rem] font-semibold text-coral-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, "h-13", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, "min-h-36 resize-y leading-relaxed", className)} {...props} />;
}
