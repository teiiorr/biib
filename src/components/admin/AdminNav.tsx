"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_COPY } from "@/lib/admin/copy";

import { AdminIcon } from "./AdminIcon";
import { ADMIN_NAV, activeHref } from "./nav";

interface AdminNavProps {
  /** Varaqda: band tanlangach varaq yopiladi. */
  readonly onNavigate?: () => void;
  /** Yon panel va varaq bir sahifada: guruh yorliqlarining id lari takrorlanmasin. */
  readonly idPrefix: string;
}

/** Guruhlangan boʻlimlar: faol band pushti yorliq va yengil fon bilan, aria-current bilan. */
export function AdminNav({ onNavigate, idPrefix }: AdminNavProps) {
  const active = activeHref(usePathname());
  return (
    <nav aria-label={ADMIN_COPY.nav.label} className="admin-nav">
      {ADMIN_NAV.map((group) => {
        const labelId = `${idPrefix}-${group.key}`;
        return (
          <div key={group.key} className="admin-nav-group">
            {group.label ? (
              <p id={labelId} className="admin-nav-heading t-micro">
                {group.label}
              </p>
            ) : null}
            <ul className="admin-nav-list" aria-labelledby={group.label ? labelId : undefined}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="admin-nav-item t-label"
                    aria-current={active === item.href ? "page" : undefined}
                    {...(onNavigate ? { onClick: onNavigate } : {})}
                  >
                    <AdminIcon name={item.icon} />
                    <span className="text-trim">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
