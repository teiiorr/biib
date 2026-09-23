import type { IconSize } from "@/components/icons/Icon";

export interface ButtonSpinnerProps {
  readonly size: IconSize;
}

export function ButtonSpinner({ size }: ButtonSpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className="ui-spinner shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" strokeOpacity="0.25" />
      <path d="M20.5 12 A8.5 8.5 0 0 0 12 3.5" />
    </svg>
  );
}
