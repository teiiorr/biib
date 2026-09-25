import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface BrandMarkProps {
  readonly locale: Locale;
  readonly dict: Dictionary["common"];
  readonly className?: string;
}

/** Brend belgisi badiiy qatlamda turadi, oyna ichida emas (15.1). */
export function BrandMark({ locale, dict, className }: BrandMarkProps) {
  return (
    <Link
      href={pathFor(locale, "home")}
      className={className ? `brand-mark ${className}` : "brand-mark"}
    >
      {/* data-brand-mark: qahramon sahnasi belgini shu rasmga qoʻndiradi (useHeroScene). */}
      <Image
        src="/brand/mark.png"
        alt={dict.brand.markAlt}
        width={40}
        height={40}
        priority
        data-brand-mark=""
      />
      <span className="brand-name" aria-hidden="true">
        <span>{dict.brand.line1}</span>
        <span>{dict.brand.line2}</span>
      </span>
      <span className="sr-only">{dict.brand.name}</span>
    </Link>
  );
}
