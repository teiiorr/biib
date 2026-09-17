import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/*
 * Çegara 0.5 px — border bilan emas, inset box-shadow bilan: brauzerlar
 * yarim piksel border ni har xil yumaloqlaydi, soya esa aniq çiqadi.
 */
const CONTROL = [
  "w-full rounded-sm bg-elevated px-3 text-body text-label",
  "shadow-[inset_0_0_0_0.5px_var(--separator)]",
  "placeholder:text-label-tertiary",
  "transition-shadow duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
  "focus:outline-none focus:shadow-[inset_0_0_0_1.5px_var(--accent)]",
  "aria-[invalid=true]:shadow-[inset_0_0_0_1.5px_var(--danger)]",
  "disabled:opacity-40",
].join(" ");

export function Field({
  id,
  label,
  children,
  error,
  hint,
  className,
}: {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/*
       * İzoh yorliq bilan bir qatorda. Pastda tursa, izohi bor maydon
       * yonidagisidan pastroq boşlanadi va qator tekisligi buziladi.
       */}
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-subhead text-label-secondary">
          {label}
        </label>
        {hint ? (
          <span id={`${id}-hint`} className="shrink-0 text-footnote text-label-secondary">
            {hint}
          </span>
        ) : null}
      </div>

      {children}

      {error ? (
        <p id={`${id}-error`} className="text-footnote text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, "min-h-32 resize-y py-3 leading-relaxed", className)} {...props} />;
}
