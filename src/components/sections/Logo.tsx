import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Belgi + til bilan yozilgan nom. PNG dagi lotin yozuvi kiril tillarda
 * toğri kelmaydi, şuning uçun nom matn bölib çiziladi.
 */
export function Logo({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  const t = useTranslations("org");

  return (
    <Link
      href="/"
      aria-label={t("nameFull")}
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
        <span className="hidden flex-col leading-[1.14] 2xl:flex">
          <span className="whitespace-nowrap font-display text-[0.94rem] font-extrabold tracking-tight text-blue-deep">
            {t("nameLine1")}
          </span>
          <span className="whitespace-nowrap font-display text-[0.78rem] font-semibold text-ink-2">
            {t("nameLine2")}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
