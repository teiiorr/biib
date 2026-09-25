"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { useSurfaceTone } from "@/components/glass/useSurfaceTone";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

interface BrandMarkProps {
  readonly locale: Locale;
  /* Butun common lugʻati emas: RSC yukiga faqat nom satrlari kiradi. */
  readonly brand: Pick<Dictionary["common"]["brand"], "line1" | "line2" | "name">;
  readonly className?: string;
  /** Serverda chizilgan belgi rasmi (Picture): rasm kodi mijoz chunkiga kirmaydi. */
  readonly children: ReactNode;
}

/**
 * Brend belgisi badiiy qatlamda turadi, oyna ichida emas (15.1). Ostidagi boʻlim ohangini oʻqiydi:
 * qorongʻi kadr va lojuvard boʻlimlar ustida nomi sut-oq, aks holda siyoh.
 */
export function BrandMark({ locale, brand, className, children }: BrandMarkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useSurfaceTone(ref, true);
  return (
    <Link
      ref={ref}
      href={pathFor(locale, "home")}
      className={className ? `brand-mark ${className}` : "brand-mark"}
    >
      {children}
      <span className="brand-name" aria-hidden="true">
        <span>{brand.line1}</span>
        <span>{brand.line2}</span>
      </span>
      <span className="sr-only">{brand.name}</span>
    </Link>
  );
}
