import { cn } from "@/lib/cn";

/**
 * Interfeys belgilari. Doodle bilan bir qalam: 24 lik tör, qalinlik 2,
 * yumaloq uçlar. Emoji işlatilmaydi — hammasi çizilgan.
 */

export type IconName =
  | "globe"
  | "check"
  | "chevron-down"
  | "menu"
  | "close"
  | "arrow-right"
  | "arrow-out"
  | "sun"
  | "moon"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "telegram"
  | "instagram"
  | "youtube"
  | "facebook";

const PATHS: Record<IconName, readonly string[]> = {
  globe: [
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    "M3.4 9.3h17.2M3.4 14.7h17.2",
    "M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9c2.4-2.5 3.6-5.5 3.6-9S14.4 5.5 12 3z",
  ],
  check: ["M4.8 12.6 9.6 17.4 19.2 6.9"],
  "chevron-down": ["M6 9.6 12 15.4l6-5.8"],
  menu: ["M3.8 7.4h16.4M3.8 12h16.4M3.8 16.6h12.4"],
  close: ["M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"],
  "arrow-right": ["M3.8 12h16", "M14.4 6.2 20.4 12l-6 5.8"],
  "arrow-out": ["M8.6 15.4 19 5", "M12.4 4.6H19.4V11.6", "M16 19.4H5.6a1 1 0 0 1-1-1V8"],
  sun: [
    "M16.4 12a4.4 4.4 0 1 1-8.8 0 4.4 4.4 0 0 1 8.8 0z",
    "M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.4 5.4 7.1 7.1M16.9 16.9l1.7 1.7M18.6 5.4 16.9 7.1M7.1 16.9l-1.7 1.7",
  ],
  moon: ["M20.4 14.2A8.6 8.6 0 0 1 9.5 3.6a8.8 8.8 0 1 0 10.9 10.6z", "M17.6 4.2v3.2M16 5.8h3.2"],
  mail: ["M3.4 6.6h17.2v10.8H3.4z", "m3.8 7.2 8.2 6 8.2-6"],
  phone: [
    "M7.4 3.6c1 0 1.6.6 2 1.6l1 2.4c.3.8.1 1.4-.6 1.9l-1.2.9c.9 2.2 2.5 3.8 4.7 4.7l.9-1.2c.5-.7 1.1-.9 1.9-.6l2.4 1c1 .4 1.6 1 1.6 2 0 2.3-1.9 3.8-4.2 3.4C10.2 20.4 3.6 13.8 4 8.1 3.7 5.6 5.1 3.6 7.4 3.6z",
  ],
  pin: ["M19.2 10.2c0 5-7.2 11-7.2 11s-7.2-6-7.2-11a7.2 7.2 0 0 1 14.4 0z", "M14.6 10a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z"],
  clock: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", "M12 6.6V12l3.6 2.2"],
  telegram: ["M20.6 4.4 3.6 11.1l4.9 1.7 1.9 5.6 2.7-3.2 4.5 3.3z", "m8.5 12.8 8.6-6.1-4.8 8.5"],
  instagram: [
    "M16.6 3.6H7.4A3.8 3.8 0 0 0 3.6 7.4v9.2a3.8 3.8 0 0 0 3.8 3.8h9.2a3.8 3.8 0 0 0 3.8-3.8V7.4a3.8 3.8 0 0 0-3.8-3.8z",
    "M15.9 12a3.9 3.9 0 1 1-7.8 0 3.9 3.9 0 0 1 7.8 0z",
    "M17.3 6.9h.01",
  ],
  youtube: [
    "M20.4 8.2c-.2-1.4-.9-2.2-2.3-2.4C16.3 5.5 14.2 5.4 12 5.4s-4.3.1-6.1.4c-1.4.2-2.1 1-2.3 2.4-.2 1.3-.3 2.5-.3 3.8s.1 2.5.3 3.8c.2 1.4.9 2.2 2.3 2.4 1.8.3 3.9.4 6.1.4s4.3-.1 6.1-.4c1.4-.2 2.1-1 2.3-2.4.2-1.3.3-2.5.3-3.8s-.1-2.5-.3-3.8z",
    "m10.3 9.2 4.6 2.8-4.6 2.8z",
  ],
  facebook: ["M14.6 21.2v-8h2.8l.5-3.4h-3.3V7.5c0-1 .4-1.7 1.8-1.7h1.6V2.9c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2.6H8v3.4h3v8z"],
};

export interface IconProps {
  name: IconName;
  className?: string;
  /** Belgi maʼnoli bölsa — nom beriladi, aks holda bezak sanaladi. */
  title?: string;
  strokeWidth?: number;
}

const SOLID = new Set<IconName>(["facebook"]);

export function Icon({ name, className, title, strokeWidth = 1.9 }: IconProps) {
  const solid = SOLID.has(name);

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name].map((d, index) => (
        <path
          key={index}
          d={d}
          fill={solid ? "currentColor" : "none"}
          stroke={solid ? "none" : "currentColor"}
          strokeWidth={solid ? undefined : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
