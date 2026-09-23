import Image from "next/image";

interface AbrPosterProps {
  readonly alt: string;
  readonly className?: string;
}

/** Statik poster: WebGL yoʻq, kamaytirilgan harakat va shader yuklanguncha. */
export function AbrPoster({ alt, className }: AbrPosterProps) {
  return (
    <span className={className}>
      <Image
        src="/hero/abr-poster-day.avif"
        alt={alt}
        fill
        sizes="100vw"
        priority={false}
        className="object-cover dark:hidden"
      />
      <Image
        src="/hero/abr-poster-night.avif"
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="hidden object-cover dark:block"
      />
    </span>
  );
}
