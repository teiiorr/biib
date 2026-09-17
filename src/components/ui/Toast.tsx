"use client";

import { useEffect } from "react";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/**
 * Bitta tost, ekranda birdan ortiq bölmaydi. Muvaffaqiyat 4 soniyada
 * özi yopiladi, xato — yöq: xatoni foydalanuvçi öqib ulgurişi kerak.
 */
export function Toast({
  open,
  onClose,
  title,
  description,
  tone = "success",
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  tone?: "success" | "danger";
  closeLabel: string;
}) {
  useEffect(() => {
    if (!open || tone !== "success") return;
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [open, tone, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      className={cn(
        "glass fixed inset-x-4 bottom-4 z-[var(--z-toast)] flex items-start gap-3 rounded-lg p-4",
        "shadow-ambient sm:left-auto sm:right-6 sm:w-96",
        "animate-[sheet-in_var(--dur-base)_var(--ease-standard)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-pill",
          tone === "success" ? "bg-success" : "bg-danger",
        )}
      >
        <Icon name={tone === "success" ? "check" : "close"} className="h-3.5 w-3.5 text-white" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-callout font-semibold text-label">{title}</p>
        {description ? (
          <p className="mt-0.5 text-footnote text-label-secondary">{description}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="tap grid h-6 w-6 shrink-0 place-items-center rounded-xs text-label-secondary hover:text-label"
      >
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  );
}
