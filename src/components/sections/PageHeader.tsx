import type { ReactNode } from "react";

/** Sahifa boşi: bitta H1 va qisqa kiriş. Kiker yöq, rangli söz yöq. */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page pb-6 pt-10 md:pt-14">
      <h1 className="text-title1 md:text-display">{title}</h1>
      {lead ? <p className="read mt-4 text-body text-label-secondary">{lead}</p> : null}
      {children}
    </header>
  );
}
