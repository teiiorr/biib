import type { StaticPathname } from "@/i18n/routing";

/** Sarlavhadagi va podvaldagi asosiy yönaliş. Matnlar lugatdan keladi. */
export const NAV_ITEMS = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/news", key: "news" },
  { href: "/council", key: "council" },
  { href: "/leadership", key: "leadership" },
  { href: "/partners", key: "partners" },
  { href: "/contacts", key: "contacts" },
] as const satisfies ReadonlyArray<{ href: StaticPathname; key: string }>;

export type NavItem = (typeof NAV_ITEMS)[number];
