"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { useSurfaceTone } from "@/components/glass/useSurfaceTone";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

import { BrandName } from "./BrandName";

interface BrandMarkProps {
  readonly locale: Locale;
  /** Havolaning ekran oʻquvchi nomi: joriy tildagi toʻliq nom. */
  readonly name: string;
  readonly className?: string;
  /** Serverda chizilgan belgi rasmi (BrandLogo): rasm kodi mijoz chunkiga kirmaydi. */
  readonly children: ReactNode;
}

/**
 * Brend belgisi badiiy qatlamda turadi, oyna ichida emas (15.1). Ostidagi boʻlim ohangini oʻqiydi:
 * qorongʻi kadr va lojuvard boʻlimlar ustida yozuv sut-oq, belgi oq (ui.css .brand-logo).
 */
export function BrandMark({ locale, name, className, children }: BrandMarkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useSurfaceTone(ref, true);
  return (
    <Link
      ref={ref}
      href={pathFor(locale, "home")}
      className={className ? `brand-mark ${className}` : "brand-mark"}
    >
      {children}
      <BrandName />
      <span className="sr-only">{name}</span>
    </Link>
  );
}
