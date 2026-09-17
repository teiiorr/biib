import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BRAND_NAME } from "@/content/org";
import { cn } from "@/lib/cn";

/**
 * Belgi va nom. Nom oddiy kapitalizatsiyada: ALL CAPS §4.6 da taqiqlangan,
 * logotipdagi katta harflar esa belgi rasmining özida qoladi.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={BRAND_NAME.full}
      className={cn("tap flex shrink-0 items-center gap-2.5 rounded-sm", className)}
    >
      <Image
        src="/brand/mark.png"
        alt=""
        width={96}
        height={96}
        priority
        sizes="40px"
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
      />
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-subhead font-semibold text-label">{BRAND_NAME.line1}</span>
        <span className="text-caption text-label-secondary">{BRAND_NAME.line2}</span>
      </span>
    </Link>
  );
}
