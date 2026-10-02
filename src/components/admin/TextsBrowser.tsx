"use client";

import Link from "next/link";
import { useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import type { TextListRow } from "@/lib/admin/texts/types";

import { AdminIcon } from "./AdminIcon";

interface TextsBrowserProps {
  readonly rows: readonly TextListRow[];
  /** Tahrirdan «Barcha matnlar» bilan qaytilganda qidiruv saqlanadi (?q=). */
  readonly initialQuery: string;
}

const T = SYSTEM_COPY.texts;
/* Avval sahifalar tartibida, keyin SEO va butun saytdagi umumiy qismlar. */
const ORDER = [
  "home",
  "about",
  "projects",
  "news",
  "people",
  "partners",
  "contacts",
  "privacy",
  "meta",
  "common",
  "nav",
  "footer",
  "appearance",
  "errors",
];
const LABELS: Readonly<Record<string, string>> = T.namespaces;

function rank(namespace: string): number {
  const index = ORDER.indexOf(namespace);
  return index < 0 ? ORDER.length : index;
}

/* Tahrirdan orqaga qaytganda roʻyxat oʻsha qidiruv bilan ochilishi uchun. */
function rememberQuery(value: string): void {
  try {
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  } catch {
    /* Manzil yozilmasa ham qidiruv ishlayveradi. */
  }
}

/** Qidiruv yoki «faqat oʻzgartirilganlar» tanlanganda hamma guruh ochiq turadi. */
export function TextsBrowser({ rows, initialQuery }: TextsBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [onlyChanged, setOnlyChanged] = useState(false);
  const needle = query.trim().toLowerCase();
  const visible = rows.filter(
    (row) => (!onlyChanged || row.changed) && (!needle || row.haystack.includes(needle)),
  );
  const namespaces = [...new Set(visible.map((row) => row.namespace))].sort(
    (a, b) => rank(a) - rank(b),
  );
  const open = Boolean(needle) || onlyChanged;
  const changedCount = rows.filter((row) => row.changed).length;
  const suffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";

  return (
    <div className="admin-texts">
      <Field id="admin-texts-q" label={T.search} hint={T.searchHint}>
        {(control) => (
          <Input
            {...control}
            type="search"
            value={query}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => {
              setQuery(event.target.value);
              rememberQuery(event.target.value);
            }}
          />
        )}
      </Field>
      <div className="admin-texts-bar">
        <p className="t-small text-ink-2 tnum" role="status">
          {visible.length ? fill(T.found, { n: visible.length }) : T.none}
        </p>
        <Checkbox
          id="admin-texts-changed"
          label={`${T.onlyChanged} (${changedCount})`}
          checked={onlyChanged}
          onChange={(event) => setOnlyChanged(event.target.checked)}
        />
      </div>
      {namespaces.map((namespace) => {
        const items = visible.filter((row) => row.namespace === namespace);
        return (
          <details
            key={`${namespace}-${open ? "open" : "closed"}`}
            className="admin-tree"
            open={open}
          >
            <summary className="admin-tree-head">
              <AdminIcon name="chevron-right" size={20} className="admin-tree-chevron" />
              <span className="t-label text-ink">{LABELS[namespace] ?? namespace}</span>
              <span className="admin-tree-count t-micro tnum">{items.length}</span>
            </summary>
            <ul className="admin-tree-list">
              {items.map((row) => (
                <li key={row.key}>
                  <Link href={`/admin/matnlar/${row.key}${suffix}`} className="admin-tree-item">
                    <span className="admin-tree-key t-micro">{row.key}</span>
                    <span className="admin-tree-value t-small" lang="uz-Latn">
                      {row.preview}
                    </span>
                    {row.changed || row.kind === "list" || namespace === "meta" ? (
                      <span className="admin-tree-tags">
                        {row.changed ? <Tag tone="accent">{T.changed}</Tag> : null}
                        {row.kind === "list" ? <Tag>{T.list}</Tag> : null}
                        {namespace === "meta" ? <Tag tone="art-3">{T.seo}</Tag> : null}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
