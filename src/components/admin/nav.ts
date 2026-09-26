import { ADMIN_COPY } from "@/lib/admin/copy";
import type { AdminPath } from "@/lib/admin/paths";

import type { AnyIconName } from "./AdminIcon";

export interface AdminNavItem {
  readonly href: AdminPath;
  readonly label: string;
  readonly icon: AnyIconName;
}

export interface AdminNavGroup {
  readonly key: string;
  /** null: guruh sarlavhasiz (bosh sahifa bandi). */
  readonly label: string | null;
  readonly items: readonly AdminNavItem[];
}

const P = ADMIN_COPY.pages;
const G = ADMIN_COPY.nav.groups;

/** Yon panel va telefon varagʻi bitta roʻyxatdan: tartib ikkalasida bir xil. */
export const ADMIN_NAV: readonly AdminNavGroup[] = [
  {
    key: "home",
    label: null,
    items: [{ href: "/admin", label: P.dashboard, icon: "dashboard" }],
  },
  {
    key: "content",
    label: G.content,
    items: [
      { href: "/admin/yangiliklar", label: P.news, icon: "news" },
      { href: "/admin/upop", label: P.upop, icon: "ticket" },
      { href: "/admin/upop/galereya", label: P.gallery, icon: "image" },
      { href: "/admin/tarix", label: P.history, icon: "calendar" },
      { href: "/admin/matnlar", label: P.texts, icon: "text" },
    ],
  },
  {
    key: "people",
    label: G.people,
    items: [
      { href: "/admin/rahbariyat", label: P.leadership, icon: "user" },
      { href: "/admin/ekspertlar", label: P.experts, icon: "users" },
    ],
  },
  {
    key: "organization",
    label: G.organization,
    items: [
      { href: "/admin/hamkorlar", label: P.partners, icon: "building" },
      { href: "/admin/aloqa", label: P.contacts, icon: "contact" },
    ],
  },
  {
    key: "system",
    label: G.system,
    items: [
      { href: "/admin/media", label: P.media, icon: "folder" },
      { href: "/admin/jurnal", label: P.journal, icon: "clock" },
      { href: "/admin/xavfsizlik", label: P.security, icon: "shield" },
    ],
  },
];

/** Eng uzun mos kelgan band faol: /admin/upop/galereya ochiqda «UPOP» emas, «Galereya» belgilanadi. */
export function activeHref(pathname: string): AdminPath | null {
  let best: AdminPath | null = null;
  for (const group of ADMIN_NAV) {
    for (const { href } of group.items) {
      const match =
        href === "/admin"
          ? pathname === "/admin"
          : pathname === href || pathname.startsWith(`${href}/`);
      if (match && (!best || href.length > best.length)) best = href;
    }
  }
  return best;
}
