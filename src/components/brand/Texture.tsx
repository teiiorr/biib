import { cn } from "@/lib/cn";

/** Plyonka zarrasi — butun sahifa ustida bitta statik qatlam. */
export function Grain() {
  return <div aria-hidden="true" className="grain" />;
}

/** Girih suv belgisi. Bezak, şuning uçun öqigiçdan yaşirilgan. */
export function Girih({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("girih", className)} />;
}

/**
 * Qahramon ortidagi aura. Ekranda bittasi: §16.5 böyiça bir bölimga
 * bitta muallif jesti.
 */
export function Aura({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("aura", className)} />;
}
