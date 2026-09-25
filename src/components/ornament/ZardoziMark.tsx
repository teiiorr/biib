import { cx } from "@/lib/cx";

export interface ZardoziMarkProps {
  readonly className?: string;
}

/** Faol navigatsiya belgisi: 20 × 5 px, ikki ip, uch chok. Holatni bildirgani uchun --accent-text (3:1). */
export function ZardoziMark({ className }: ZardoziMarkProps) {
  return (
    <svg
      className={cx("orn zardozi-mark text-accent-text", className)}
      viewBox="0 0 20 5"
      aria-hidden="true"
      focusable="false"
    >
      <line className="zardozi-thread" x1={0} x2={20} y1={1.5} y2={1.5} />
      <line className="zardozi-thread" x1={0} x2={20} y1={3.5} y2={3.5} />
      <path className="zardozi-stitch" d="M3 0.5V4.5M9 0.5V4.5M15 0.5V4.5" />
    </svg>
  );
}
