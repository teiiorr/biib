import { cx } from "@/lib/cx";

import { Picture } from "./Picture";

export type BrandLogoSize = 32 | 40 | 48 | 96 | 160;

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
 * Sahna belgisi sarlavhada aynan shu rasmga qoʻnadi, shuning uchun u har ohangda bir xil va filtrsiz:
 * lojuvard disk ikkala zaminda ham oltin qirrasi bilan ajralib turadi.
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
