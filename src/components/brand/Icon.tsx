import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Interfeys belgilari. Lucide — bitta töplam, bitta qalam.
 * Ijtimoiy tarmoq belgilari Lucide dan çiqarilgan, şuning uçun ular
 * quyida qölda çizilgan, ammo öşa qalinlik va yumaloq uçlar bilan.
 */

const SET = {
  globe: Globe,
  check: Check,
  "chevron-down": ChevronDown,
  menu: Menu,
  close: X,
  "arrow-right": ArrowRight,
  "arrow-out": ArrowUpRight,
  sun: Sun,
  moon: Moon,
  mail: Mail,
  phone: Phone,
  pin: MapPin,
  clock: Clock,
  telegram: Send,
} satisfies Record<string, LucideIcon>;

/** Lucide da brend belgilari yöq — bu üçtasi qölda. */
const BRAND = {
  instagram: [
    "M16.6 3.6H7.4A3.8 3.8 0 0 0 3.6 7.4v9.2a3.8 3.8 0 0 0 3.8 3.8h9.2a3.8 3.8 0 0 0 3.8-3.8V7.4a3.8 3.8 0 0 0-3.8-3.8z",
    "M15.9 12a3.9 3.9 0 1 1-7.8 0 3.9 3.9 0 0 1 7.8 0z",
    "M17.3 6.9h.01",
  ],
  youtube: [
    "M20.4 8.2c-.2-1.4-.9-2.2-2.3-2.4C16.3 5.5 14.2 5.4 12 5.4s-4.3.1-6.1.4c-1.4.2-2.1 1-2.3 2.4-.2 1.3-.3 2.5-.3 3.8s.1 2.5.3 3.8c.2 1.4.9 2.2 2.3 2.4 1.8.3 3.9.4 6.1.4s4.3-.1 6.1-.4c1.4-.2 2.1-1 2.3-2.4.2-1.3.3-2.5.3-3.8s-.1-2.5-.3-3.8z",
    "m10.3 9.2 4.6 2.8-4.6 2.8z",
  ],
  facebook: ["M14.6 21.2v-8h2.8l.5-3.4h-3.3V7.5c0-1 .4-1.7 1.8-1.7h1.6V2.9c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2.6H8v3.4h3v8"],
} as const;

export type IconName = keyof typeof SET | keyof typeof BRAND;

export interface IconProps {
  name: IconName;
  className?: string;
  /** Belgi maʼnoli bölsa — nom beriladi, aks holda bezak sanaladi. */
  title?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, title, strokeWidth = 1.9 }: IconProps) {
  const shared = {
    className: cn("h-5 w-5 shrink-0", className),
    "aria-hidden": title ? undefined : (true as const),
    role: title ? ("img" as const) : undefined,
    "aria-label": title,
    focusable: "false" as const,
  };

  if (name in BRAND) {
    const paths = BRAND[name as keyof typeof BRAND];
    return (
      <svg viewBox="0 0 24 24" {...shared}>
        {paths.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    );
  }

  const Glyph = SET[name as keyof typeof SET];
  return <Glyph {...shared} strokeWidth={strokeWidth} absoluteStrokeWidth />;
}
