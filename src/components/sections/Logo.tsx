import Image from "next/image";
import { BRAND_NAME } from "@/content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Belgi va yonida taşkilot nomi. Nom barça tillarda bir xil. */
export function Logo({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={BRAND_NAME.full}
      className={cn(
        "group flex shrink-0 items-center gap-2.5 rounded-btn",
        "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
        className,
      )}
    >
      <Image
        src="/brand/mark.png"
        alt=""
        width={128}
        height={128}
        priority
        sizes="56px"
        className={cn(
          "h-11 w-11 shrink-0 transition-transform duration-300 ease-[var(--ease-pop)]",
          "group-hover:-rotate-6 group-hover:scale-105 sm:h-12 sm:w-12",
        )}
      />
      {showName ? (
        <span className="hidden flex-col leading-[1.2] xl:flex">
          <span className="whitespace-nowrap font-display text-[0.82rem] font-extrabold tracking-[0.01em] text-blue-deep">
            {BRAND_NAME.line1}
          </span>
          <span className="whitespace-nowrap font-display text-[0.7rem] font-semibold tracking-[0.02em] text-ink-2">
            {BRAND_NAME.line2}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
