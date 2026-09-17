import { cn } from "@/lib/cn";

/** 16 px halqa. Yuklaniş paytida tugmadagi belgi örniga turadi. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-4 w-4 animate-spin rounded-pill border-2 border-current border-t-transparent opacity-80",
        className,
      )}
    />
  );
}
