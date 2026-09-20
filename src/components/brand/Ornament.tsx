import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
 * Özbek milliy naqşlari. Hammasi çiziq bilan işlanadi — Temuriylar
 * uslubidagi ingiçka oltin qalam, quyuq bezak emas. Rang currentColor
 * dan keladi: çaqiruvçi oltin yoki samosvet berishi mumkin.
 *
 * Barçasi bezak, şuning uçun öqigiçdan yaşiriladi (aria-hidden).
 */

/**
 * Islimi — ösimlik novdasi. Ravoq yelkasidan (kartaning arki yon bilan
 * tutaşgan joyidan) çirmaşib çiqadigan kiçik gul. Çapga çizilgan;
 * öng yelka uçun oʻzgaruvçi scaleX(-1) qiladi.
 */
export function IslimiSpandrel({
  side = "left",
  className,
}: {
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("islimi", className)}
      style={{ "--flip": side === "right" ? -1 : 1 } as CSSProperties}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Asosiy novda: pastdan öng burçakdan çiqib, çapga çirmaşadi. */}
        <path d="M60 58 C42 56 30 48 26 34 C23 24 27 15 36 13" />
        {/* İkkinçi burama — çuqurlik uçun. */}
        <path d="M52 57 C40 51 34 42 33 32 C32.4 26 34 21 39 19" opacity={0.72} />
        {/* Barg — novdaning ortasida. */}
        <path d="M33 34 C26 33 21 36 19 43 C25 44 30 41 33 34 Z" />
        {/* Guncha uçidagi tomçi. */}
        <path d="M36 13 C40 11 44 12 45 16 C46 20 43 23 39 22 C35.6 21 34 16 36 13 Z" />
      </g>
      {/* Guncha markazi — töldirilgan nuqta. */}
      <circle cx={40} cy={16.5} r={1.7} fill="currentColor" />
    </svg>
  );
}

/**
 * Kalit toş — ravoqning cho'qqisidagi finial. Lotus kurtagi şaklida,
 * yuqoriga qaragan tomçi. Arkning aynan ustida turadi.
 */
export function ArchKeystone({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 34"
      fill="none"
      aria-hidden="true"
      className={cn("keystone", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Tomçi tanasi. */}
        <path d="M12 2 C16 9 19 13 19 19 C19 26 15 31 12 31 C9 31 5 26 5 19 C5 13 8 9 12 2 Z" />
        {/* İçki qirra. */}
        <path d="M12 10 C14 14 15.5 16.5 15.5 19.5 C15.5 24 13.6 27 12 27.5" opacity={0.7} />
      </g>
      <circle cx={12} cy={19.5} r={1.8} fill="currentColor" />
    </svg>
  );
}

/**
 * Naqş çizigʻi — bölimlar orasidagi ajratgiç. Ortada girih yulduzi,
 * ikki yonida çirmaşgan islimi, çetlarga qarab söniladi. Bir sahifada
 * bir neçta bölimni bogʻlaydigan yagona bezakli belgi.
 */
export function OrnamentBand({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("ornament-band", className)}>
      <span className="ornament-band__rule" />
      <svg viewBox="0 0 120 32" fill="none" className="ornament-band__mark">
        <g
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Markaziy girih yulduzi — ikki ustma-ust kvadrat. */}
          <path d="M60 6 74 16 60 26 46 16 Z" />
          <path d="M52 9 68 9 68 23 52 23 Z" opacity={0.55} />
          <circle cx={60} cy={16} r={2.1} fill="currentColor" stroke="none" />
          {/* Yon islimi burmalari. */}
          <path d="M46 16 C36 16 30 12 22 16 C30 20 36 16 46 16" />
          <path d="M74 16 C84 16 90 12 98 16 C90 20 84 16 74 16" />
          <path d="M22 16 C17 13 12 15 10 16 C12 17 17 19 22 16" opacity={0.7} />
          <path d="M98 16 C103 13 108 15 110 16 C108 17 103 19 98 16" opacity={0.7} />
        </g>
      </svg>
      <span className="ornament-band__rule" />
    </div>
  );
}

/**
 * Paxta — milliy gul. Kiçik urgʻu yoki röyxat belgisi sifatida.
 * Ochilgan kösak: uç barg va ortasida tola nuqtalari.
 */
export function Pakhta({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("pakhta", className)}
    >
      <g stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
        {/* Uç kösak bargi. */}
        <path d="M12 12 C10 5 12 2 12 2 C12 2 14 5 12 12 Z" />
        <path d="M12 12 C6 10 3 12 3 12 C3 12 6 16 12 12 Z" />
        <path d="M12 12 C18 10 21 12 21 12 C21 12 18 16 12 12 Z" />
        <path d="M12 12 C10 18 12 22 12 22 C12 22 14 18 12 12 Z" opacity={0.75} />
      </g>
      {/* Tola nuqtalari. */}
      <circle cx={12} cy={11.5} r={1.6} fill="currentColor" />
      <circle cx={9.6} cy={13.4} r={0.9} fill="currentColor" opacity={0.7} />
      <circle cx={14.4} cy={13.4} r={0.9} fill="currentColor" opacity={0.7} />
    </svg>
  );
}
