import { cx } from "@/lib/cx";

import { Picture } from "./Picture";

export type BrandLogoSize = 32 | 40 | 48;

export interface BrandLogoProps {
  /** Maʼnoli belgi (sarlavhadagi brend) uchun nom; bezak oʻrnida boʻsh satr. */
  readonly alt: string;
  readonly size?: BrandLogoSize;
  /** Birinchi ekrandagi belgi: dangasa yuklanmaydi. */
  readonly eager?: boolean;
  readonly className?: string;
  readonly attrs?: Readonly<Record<`data-${string}`, string>>;
}

/**
 * Birlashmaning haqiqiy belgisi (koʻk disk, shakllar shaffof kesilgan). Tungi mavzuda va qorongʻi
 * boʻlim ustida oq boʻladi (ui.css .brand-logo): shakllar shaffof boʻlgani uchun filtr oq diskni beradi.
 */
export function BrandLogo({ alt, size = 40, eager = false, className, attrs }: BrandLogoProps) {
  return (
    <Picture
      src="/brand/mark.png"
      alt={alt}
      width={size}
      height={size}
      eager={eager}
      className={cx("brand-logo", className)}
      {...(attrs ? { attrs } : {})}
    />
  );
}
