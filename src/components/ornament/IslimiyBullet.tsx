import { cn } from "@/lib/cn";
import { bodomPath } from "@/lib/ornament/leaves";

export interface IslimiyBulletProps {
  readonly className?: string;
}

/** Roʻyxat belgisi: qisqa poya va bodom kurtagi (16 px, matn oldida). Roʻyxat list-style: none beradi. */
export function IslimiyBullet({ className }: IslimiyBulletProps) {
  return (
    <svg
      className={cn("orn islimiy-bullet text-accent-art", className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path className="orn-strand" d="M1 13 C4 13 6 11 7 8.5" />
      <path
        className="islimiy-bud"
        d={bodomPath()}
        transform="translate(6.5 8.5) rotate(-42) scale(9)"
      />
    </svg>
  );
}
