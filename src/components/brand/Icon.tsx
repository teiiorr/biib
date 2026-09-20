import { cn } from "@/lib/cn";

/**
 * Bitta töplam: 24 lik tör, çiziq qalinligi 1.75, yumaloq uçlar.
 * Töplamlar aralaştirilmaydi va emoji işlatilmaydi.
 */

export type IconName =
  | "globe"
  | "check"
  | "chevron-down"
  | "menu"
  | "close"
  | "arrow-out"
  | "sliders"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "play"
  | "pause"
  | "telegram"
  | "instagram"
  | "youtube"
  | "facebook";

const PATHS: Record<IconName, readonly string[]> = {
  globe: [
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    "M3.6 9h16.8M3.6 15h16.8",
    "M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z",
  ],
  check: ["m5 12.5 4.5 4.5L19 7.5"],
  "chevron-down": ["m6 9.5 6 6 6-6"],
  menu: ["M4 7h16M4 12h16M4 17h16"],
  close: ["m6 6 12 12M18 6 6 18"],
  "arrow-out": [
    "M9.5 14.5 19.5 4.5",
    "M13.5 4.5h6v6",
    "M19 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5h4",
  ],
  sliders: [
    "M4 8h10M18.5 8H20M4 16h4M12.5 16H20",
    "M16.25 8a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM10.25 16a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
  ],
  mail: ["M3.5 6.5h17v11h-17z", "m4 7 8 5.6L20 7"],
  phone: [
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C11.6 19.5 4.5 12.4 4.5 5.5a2 2 0 0 1 2-2Z",
  ],
  pin: [
    "M19 10.3c0 5-7 11.2-7 11.2S5 15.3 5 10.3a7 7 0 1 1 14 0Z",
    "M14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  ],
  clock: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", "M12 6.8V12l3.4 2"],
  play: ["m9.5 7.4 7.6 4.6-7.6 4.6z"],
  pause: ["M9 7v10M15 7v10"],
  telegram: [
    "M21.2 4.3 3.6 11.2a.4.4 0 0 0 0 .8l4.6 1.5 1.7 5.2a.4.4 0 0 0 .7.2l2.5-2.7 4.5 3.3a.4.4 0 0 0 .6-.2l3.5-14.4a.4.4 0 0 0-.5-.6Z",
    "m8.2 13.5 10.2-7.2-6.3 9.9",
  ],
  instagram: [
    "M16.5 3.5h-9A4 4 0 0 0 3.5 7.5v9a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4Z",
    "M15.8 12a3.8 3.8 0 1 1-7.6 0 3.8 3.8 0 0 1 7.6 0Z",
    "M17.2 7.1h.01",
  ],
  youtube: [
    "M21.4 8.3a2.6 2.6 0 0 0-1.8-1.8C18 6 12 6 12 6s-6 0-7.6.5a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2.2 12a27 27 0 0 0 .4 3.7 2.6 2.6 0 0 0 1.8 1.8C6 18 12 18 12 18s6 0 7.6-.5a2.6 2.6 0 0 0 1.8-1.8 27 27 0 0 0 .4-3.7 27 27 0 0 0-.4-3.7Z",
    "m10.2 9.4 4.6 2.6-4.6 2.6z",
  ],
  facebook: [
    "M14.4 21v-8h2.7l.4-3.1h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H8.5V13h2.8v8z",
  ],
};

/** Toʻldirilgan belgilar — ularga stroke berilmaydi. */
const SOLID = new Set<IconName>(["play", "facebook"]);

export function Icon({
  name,
  className,
  title,
}: {
  name: IconName;
  className?: string;
  /** Maʼnoli bölsa nom beriladi; aks holda bezak sanaladi. */
  title?: string;
}) {
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
          strokeWidth={solid ? undefined : 1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
