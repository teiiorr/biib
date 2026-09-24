import { ABR_BASE } from "./abr/base";

interface AbrBaseProps {
  readonly className?: string;
}

/**
 * Qahramon fonining serverdan keladigan asosi: 64 px li ipak nusxasi kattalashtirilib xiralashtiriladi.
 * Kanvas yoki toʻliq poster ustidan xira paydo boʻladi; sarlavha matni LCP boʻlib qoladi.
 */
export function AbrBase({ className }: AbrBaseProps) {
  return (
    <span className={className ? `abr-base ${className}` : "abr-base"} aria-hidden="true">
      <span
        className="abr-base-image dark:hidden"
        style={{ backgroundImage: `url(${ABR_BASE.day})` }}
      />
      <span
        className="abr-base-image hidden dark:block"
        style={{ backgroundImage: `url(${ABR_BASE.night})` }}
      />
    </span>
  );
}
