import type { CSSProperties } from "react";
import { preload } from "react-dom";

import { PREPARED_IMAGES, type PreparedImage } from "@/lib/images/manifest";

interface PictureBase {
  /** public/ ichidagi manba yoʻli (masalan /brand/news-teatr.jpg); tayyor nusxalar manifestdan. */
  readonly src: string;
  readonly alt: string;
  /** Ramkaning viewport ulushi; berilmasa kenglik boʻyicha qatʼiy oʻlcham. */
  readonly sizes?: string;
  /** LCP rasmi: HTML bilan birga yuqori ustuvorlikda soʻraladi, dangasa yuklanmaydi. */
  readonly priority?: boolean;
  /** Birinchi ekrandagi kichik rasm (belgi): dangasa emas, lekin preload ham qilinmaydi. */
  readonly eager?: boolean;
  readonly className?: string;
  /** <img> ga data-* belgilar (harakat sahnasi shu belgi orqali topadi). */
  readonly attrs?: Readonly<Record<`data-${string}`, string>>;
  readonly ariaHidden?: boolean;
}

/** fill: ota ramkani toʻldiradi (object-fit: cover); aks holda width/height bilan joy ajratiladi. */
export type PictureProps = PictureBase &
  (
    | { readonly fill: true; readonly width?: never; readonly height?: never }
    | { readonly fill?: false; readonly width: number; readonly height: number }
  );

function srcSet(image: PreparedImage, format: "avif" | "webp"): string {
  return image.widths.map((w) => `${image.base}-${w}.${format} ${w}w`).join(", ");
}

/**
 * Server rasmi: scripts/images.mjs tayyorlagan AVIF/WebP nusxalar <picture> ichida. Mijozga hech
 * qanday JS kirmaydi (next/image komponenti birinchi yuklanishda ≈ 6 KB edi). Manifestda yoʻq manba
 * (masalan keyin qoʻshilgan hamkor logotipi) oddiy <img> boʻlib chiqadi.
 */
export function Picture(props: PictureProps) {
  const { src, alt, sizes, priority = false, eager = false, className, attrs, ariaHidden } = props;
  const image = PREPARED_IMAGES[src];
  const fill = props.fill === true;
  const width = fill ? image?.width : props.width;
  const height = fill ? image?.height : props.height;
  const style: CSSProperties | undefined = image?.blur
    ? { backgroundImage: `url(${image.blur})` }
    : undefined;
  const imgClass = [fill ? "picture-fill" : null, image?.blur ? "picture-blur" : null, className]
    .filter(Boolean)
    .join(" ");
  const loading = priority || eager ? "eager" : "lazy";
  /* Yorugʻ rasm ustidagi oyna ohangini oʻzgartiradi (useSurfaceTone). */
  const extra = {
    ...attrs,
    ...(image?.bright ? { "data-tone": "light" } : {}),
    ...(ariaHidden ? { "aria-hidden": true } : {}),
  };

  if (!image) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={imgClass || undefined}
        {...extra}
      />
    );
  }

  const resolvedSizes = sizes ?? (fill ? "100vw" : `${props.width}px`);
  const avif = srcSet(image, "avif");
  if (priority) {
    preload(`${image.base}-${image.widths.at(-1)}.avif`, {
      as: "image",
      type: "image/avif",
      imageSrcSet: avif,
      imageSizes: resolvedSizes,
      fetchPriority: "high",
    });
  }
  const fallbackWidth = image.widths.find((w) => w >= 640) ?? image.widths.at(-1);
  return (
    <picture className="picture">
      <source type="image/avif" srcSet={avif} sizes={resolvedSizes} />
      <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={resolvedSizes} />
      <img
        src={`${image.base}-${fallbackWidth}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={imgClass || undefined}
        style={style}
        {...extra}
      />
    </picture>
  );
}
