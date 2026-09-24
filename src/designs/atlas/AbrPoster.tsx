import Image from "next/image";

interface AbrPosterProps {
  readonly theme: "light" | "dark";
  readonly className?: string;
}

/** Toʻliq statik poster (AVIF tayyor, qayta ishlanmaydi): faqat shader ishlay olmaganda yuklanadi. */
export function AbrPoster({ theme, className }: AbrPosterProps) {
  return (
    <Image
      src={theme === "dark" ? "/hero/abr-poster-night.avif" : "/hero/abr-poster-day.avif"}
      alt=""
      fill
      sizes="100vw"
      unoptimized
      className={className ? `abr-poster ${className}` : "abr-poster"}
    />
  );
}
