import { cx } from "@/lib/cx";

import { Picture } from "./Picture";

export type BrandLogoSize = 32 | 40 | 48 | 96;

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
 * Birlashmaning yakuniy belgisi: qahramon videosi tugaydigan oltin qirrali lojuvard disk, oltin shakllar
 * (egasining talabi). Sahna belgisi sarlavhaga aynan shu rasmga qoʻnadi, shu sabab u har ohangda bir xil,
 * filtrsiz: lojuvard disk sut zaminda ham, tungi zaminda ham oltin qirrasi bilan ajralib turadi.
 */
export function BrandLogo({ alt, size = 40, eager = false, className, attrs }: BrandLogoProps) {
  return (
    <Picture
      src="/brand/logo-hero.png"
      alt={alt}
      width={size}
      height={size}
      eager={eager}
      className={cx("brand-logo", className)}
      {...(attrs ? { attrs } : {})}
    />
  );
}
